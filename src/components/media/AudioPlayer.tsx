import { fadeProgress, shouldStartCrossfade } from '@/components/media/bgmFade'
import { makeBgmOrder } from '@/components/media/bgmOrder'
import config from '@/config'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  // 順に再生し、末尾まで来たら先頭に戻る。空なら何も描画しない
  srcs: ReadonlyArray<string>
  // true なら再生順をシャッフルする。一周するたびに並べ直す
  shuffle?: boolean
  // 曲間のクロスフェード秒数。0 ならクロスフェードしない（ended で切り替える）
  fadeSeconds?: number
  // この時刻（performance.now() 基準の ms）に向けて CM_FADE_SECONDS で BGM を下げきる。
  // CM（Page4）の前のフェードアウト用。null ならフェードアウトしない
  fadeOutAt?: number | null
  shouldPlay: boolean
}

const READY_STATE_LABEL = [
  'HAVE_NOTHING(0)',
  'HAVE_METADATA(1)',
  'HAVE_CURRENT_DATA(2)',
  'HAVE_FUTURE_DATA(3)',
  'HAVE_ENOUGH_DATA(4)',
]

const NETWORK_STATE_LABEL = [
  'NETWORK_EMPTY(0)',
  'NETWORK_IDLE(1)',
  'NETWORK_LOADING(2)',
  'NETWORK_NO_SOURCE(3)',
]

function snapshot(el: HTMLAudioElement) {
  return {
    src: el.currentSrc || el.src,
    readyState: READY_STATE_LABEL[el.readyState] ?? el.readyState,
    networkState: NETWORK_STATE_LABEL[el.networkState] ?? el.networkState,
    paused: el.paused,
    muted: el.muted,
    volume: el.volume,
    currentTime: el.currentTime,
    duration: el.duration,
    error: el.error && {
      code: el.error.code,
      message: el.error.message,
    },
  }
}

// CM（Page4）まわりのフェード秒数。
// CM 明けに BGM を再開するときのフェードインは設定によらず常にかける。
// CM 前のフェードアウト（fadeOutAt）も同じ秒数
const CM_FADE_SECONDS = 3
// 音量を更新する間隔
const VOLUME_TICK_MS = 50

// 現在の曲。order は srcs の index の再生順、index は order 上の位置。
// gen は曲送りのたびに増えるカウンタ（同じ曲でも再生し直す判定に使う）。
// <audio> を 2 つ持ち、gen % 2 の方が今の曲、もう一方が前の曲（クロスフェード用）
type Track = {
  order: number[]
  index: number
  gen: number
  prevSrc?: string
}

export default function AudioPlayer({
  srcs,
  shouldPlay,
  shuffle = false,
  fadeSeconds = 0,
  fadeOutAt = null,
}: Props) {
  const slot0Ref = useRef<HTMLAudioElement>(null)
  const slot1Ref = useRef<HTMLAudioElement>(null)
  // SSR とのハイドレーション不一致を避けるため、シャッフルはマウント後に行う
  const [track, setTrack] = useState<Track>(() => ({
    order: makeBgmOrder(srcs.length, false),
    index: 0,
    gen: 0,
  }))
  // シャッフル済みの順序が決まるまで再生しない（先頭曲が一瞬鳴るのを防ぐ）
  const [orderReady, setOrderReady] = useState(!shuffle)
  // イベントハンドラや音量制御の tick から最新の値を読むための参照
  const genRef = useRef(0)
  const shouldPlayRef = useRef(shouldPlay)
  const fadeOutAtRef = useRef(fadeOutAt)
  // 直前に再生 effect を通った track.gen。曲送りで gen が変わったのに src が同じなら
  // （同じ曲がまた来たとき）currentTime を 0 に戻す。shouldPlay の切替だけなら続きから再開する
  const lastPlayedGenRef = useRef<number>(-1)
  // 曲送り済みの gen。tick のクロスフェード開始と ended の両方から二重に曲送りしないため
  const advancedGenRef = useRef<number>(-1)
  // 前の曲をフェードアウト中か
  const crossfadingRef = useRef(false)
  // 一度再生したあとに shouldPlay=false で止めたか（次の再開が CM 明け）
  const pausedForCmRef = useRef(false)
  // CM 明けのフェードインを始めた時刻（performance.now()）。フェード中でなければ null
  const resumeFadeStartRef = useRef<number | null>(null)
  // 自動再生が拒否されたときのフォールバック解除関数
  const unarmFallbackRef = useRef<(() => void) | null>(null)
  // フォールバックのリスナから最新の tryPlay を呼ぶための参照
  const tryPlayRef = useRef<() => void>(() => {})

  const src = srcs[track.order[track.index]] ?? srcs[0]
  const currentSlot = track.gen % 2
  const slotSrcs =
    currentSlot === 0 ? [src, track.prevSrc] : [track.prevSrc, src]

  const slotEl = useCallback(
    (slot: number) => (slot === 0 ? slot0Ref.current : slot1Ref.current),
    []
  )
  const currentEl = useCallback(() => slotEl(genRef.current % 2), [slotEl])
  const prevEl = useCallback(() => slotEl((genRef.current + 1) % 2), [slotEl])

  useEffect(() => {
    genRef.current = track.gen
  }, [track.gen])
  useEffect(() => {
    shouldPlayRef.current = shouldPlay
  }, [shouldPlay])
  useEffect(() => {
    fadeOutAtRef.current = fadeOutAt
  }, [fadeOutAt])

  useEffect(() => {
    if (!shuffle) return
    // クライアントでだけ乱数を使うため、意図的にマウント後の effect で state を更新する
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrack((t) => ({ ...t, order: makeBgmOrder(srcs.length, true) }))
    setOrderReady(true)
  }, [shuffle, srcs.length])

  const goNextTrack = useCallback(() => {
    setTrack((t) => {
      const prevSrc = srcs[t.order[t.index]]
      const next = t.index + 1
      if (next < t.order.length) {
        return { ...t, index: next, gen: t.gen + 1, prevSrc }
      }
      // 一周したら先頭に戻る。シャッフル時は並べ直す（直前の曲が続かないようにする）
      const order = shuffle
        ? makeBgmOrder(srcs.length, true, t.order[t.index])
        : t.order
      return { order, index: 0, gen: t.gen + 1, prevSrc }
    })
  }, [shuffle, srcs])

  // 自動の曲送り（ended / クロスフェード開始）。同じ曲から 2 回送らない
  const advanceFromCurrent = useCallback(() => {
    if (advancedGenRef.current === genRef.current) return
    advancedGenRef.current = genRef.current
    goNextTrack()
  }, [goNextTrack])

  // 曲送りと shouldPlay 切替の両方から使う play()。
  // NotAllowedError（自動再生ポリシー）のときは、次のユーザー操作で再試行する。
  const tryPlay = useCallback(() => {
    const el = currentEl()
    if (!el) return
    const p = el.play()
    if (p && typeof p.then === 'function') {
      p.then(() => {
        console.log(`[AudioPlayer] play() resolved`, snapshot(el))
      }).catch((err: unknown) => {
        const info =
          err instanceof Error
            ? { name: err.name, message: err.message }
            : { raw: err }
        console.warn(`[AudioPlayer] play() rejected`, info, snapshot(el))
        const name = err instanceof Error ? err.name : ''
        if (name === 'NotAllowedError') {
          armInteractionFallback()
        }
      })
    }

    function armInteractionFallback() {
      if (unarmFallbackRef.current) return
      console.log(`[AudioPlayer] arming interaction fallback`)
      const events: Array<keyof DocumentEventMap> = [
        'pointerdown',
        'keydown',
        'touchstart',
      ]
      const onInteract = () => {
        console.log(`[AudioPlayer] user interaction detected, retrying play()`)
        unarm()
        if (!currentEl()) return
        tryPlayRef.current()
      }
      const unarm = () => {
        events.forEach((name) =>
          document.removeEventListener(name, onInteract, true)
        )
        unarmFallbackRef.current = null
      }
      events.forEach((name) =>
        document.addEventListener(name, onInteract, true)
      )
      unarmFallbackRef.current = unarm
    }
  }, [currentEl])
  useEffect(() => {
    tryPlayRef.current = tryPlay
  }, [tryPlay])

  // 前の曲のフェードアウトを打ち切って止める。今の曲の音量は音量制御の tick が決める
  const stopCrossfade = useCallback(() => {
    crossfadingRef.current = false
    const prev = prevEl()
    if (prev) {
      prev.pause()
      prev.volume = 1
    }
  }, [prevEl])

  // 診断ログ
  useEffect(() => {
    const cleanups = [0, 1].map((slot) => {
      const el = slotEl(slot)
      if (!el) return () => {}

      const log = (event: string) => (e?: Event) => {
        console.log(`[AudioPlayer] slot${slot} ${event}`, snapshot(el), e)
      }

      const handlers: Array<
        [keyof HTMLMediaElementEventMap, (e: Event) => void]
      > = [
        ['loadstart', log('loadstart')],
        ['loadedmetadata', log('loadedmetadata')],
        ['loadeddata', log('loadeddata')],
        ['canplay', log('canplay')],
        ['canplaythrough', log('canplaythrough')],
        ['play', log('play')],
        ['playing', log('playing')],
        ['pause', log('pause')],
        ['waiting', log('waiting')],
        ['stalled', log('stalled')],
        ['suspend', log('suspend')],
        ['abort', log('abort')],
        ['emptied', log('emptied')],
        ['ended', log('ended')],
        [
          'error',
          (e) => {
            console.error(`[AudioPlayer] slot${slot} error`, snapshot(el), e)
          },
        ],
      ]
      handlers.forEach(([name, h]) => el.addEventListener(name, h))
      console.log(`[AudioPlayer] slot${slot} mount`, snapshot(el))
      return () => {
        handlers.forEach(([name, h]) => el.removeEventListener(name, h))
      }
    })
    return () => cleanups.forEach((c) => c())
  }, [slotEl])

  // 今の曲が終わったら次へ（loop 属性は付けない。付けると ended が発火しない）。
  // クロスフェード中に前の曲が終わった ended は無視する
  useEffect(() => {
    const onEnded = (e: Event) => {
      if (e.target !== currentEl()) return
      advanceFromCurrent()
    }
    const els = [slotEl(0), slotEl(1)]
    els.forEach((el) => el?.addEventListener('ended', onEnded))
    return () => els.forEach((el) => el?.removeEventListener('ended', onEnded))
  }, [slotEl, currentEl, advanceFromCurrent])

  // 音量の制御。VOLUME_TICK_MS ごとに
  // 「CM 明けのフェードイン × CM 前のフェードアウト × クロスフェード」で決める。
  // rAF は非表示のタブで止まり、フェードイン途中の無音のまま戻らなくなるので setInterval を使う。
  // クロスフェードは、今の曲の残りが fadeSeconds になったら次の曲を重ね始め、
  // 新しい曲の再生位置に合わせて前の曲を下げ、新しい曲を上げる
  useEffect(() => {
    const resumeGain = () => {
      const start = resumeFadeStartRef.current
      if (start === null) return 1
      const g = fadeProgress(
        (performance.now() - start) / 1000,
        CM_FADE_SECONDS
      )
      if (g >= 1) resumeFadeStartRef.current = null
      return g
    }
    const fadeOutGain = () => {
      const at = fadeOutAtRef.current
      if (at === null) return 1
      return fadeProgress((at - performance.now()) / 1000, CM_FADE_SECONDS)
    }
    const tick = () => {
      const cur = currentEl()
      const prev = prevEl()
      if (!cur || !shouldPlayRef.current) return
      const gain = resumeGain() * fadeOutGain()
      if (crossfadingRef.current && prev) {
        const p = fadeProgress(cur.currentTime, fadeSeconds)
        cur.volume = p * gain
        prev.volume = (1 - p) * gain
        if (p >= 1) stopCrossfade()
        return
      }
      cur.volume = gain
      if (
        !cur.paused &&
        shouldStartCrossfade(cur.currentTime, cur.duration, fadeSeconds)
      ) {
        advanceFromCurrent()
      }
    }
    const timer = setInterval(tick, VOLUME_TICK_MS)
    return () => clearInterval(timer)
  }, [fadeSeconds, currentEl, prevEl, stopCrossfade, advanceFromCurrent])

  // 再生・停止。shouldPlay の切替と曲送り（track）の両方で走る
  useEffect(() => {
    const el = currentEl()
    if (!el) return
    console.log(
      `[AudioPlayer] shouldPlay=${shouldPlay} track=${track.order[track.index]}`,
      snapshot(el)
    )

    if (!shouldPlay || !orderReady) {
      // Page4 などへはクロスフェードせず即座に止める
      el.pause()
      stopCrossfade()
      if (!shouldPlay && lastPlayedGenRef.current !== -1) {
        pausedForCmRef.current = true
      }
      return
    }
    if (pausedForCmRef.current) {
      // CM 明けは無音から CM_FADE_SECONDS かけて戻す
      pausedForCmRef.current = false
      resumeFadeStartRef.current = performance.now()
      el.volume = 0
    }
    const isTrackAdvance =
      lastPlayedGenRef.current !== -1 && lastPlayedGenRef.current !== track.gen
    if (isTrackAdvance) {
      if (el.currentSrc.endsWith(src)) {
        // 同じ曲をもう一度最初から（1 曲構成でのループなど）
        el.currentTime = 0
      }
      const prev = prevEl()
      if (fadeSeconds > 0 && prev && !prev.paused) {
        // 前の曲は鳴らしたまま、音量制御の tick で音量を入れ替える
        crossfadingRef.current = true
        el.volume = 0
      } else {
        stopCrossfade()
      }
    }
    lastPlayedGenRef.current = track.gen
    tryPlay()

    return () => {
      if (unarmFallbackRef.current) unarmFallbackRef.current()
    }
  }, [
    shouldPlay,
    orderReady,
    track,
    src,
    fadeSeconds,
    tryPlay,
    currentEl,
    prevEl,
    stopCrossfade,
  ])

  useEffect(() => {
    const el = currentEl()
    if (!el) return
    console.log(`[AudioPlayer] src changed -> ${src}`, snapshot(el))
  }, [src, currentEl])

  const play = useCallback(() => {
    const el = currentEl()
    if (!el) return
    el.load()
    const p = el.play()
    if (p && typeof p.then === 'function') {
      p.catch((err: unknown) => {
        const info =
          err instanceof Error
            ? { name: err.name, message: err.message }
            : { raw: err }
        console.warn(`[AudioPlayer] manual play() rejected`, info, snapshot(el))
      })
    }
  }, [currentEl])

  if (srcs.length === 0) return null

  return (
    <>
      {config.debug && (
        <>
          <button
            onClick={play}
            className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-blue-300 items-right"
          >
            Audio AutoPlay
          </button>
          <button
            onClick={goNextTrack}
            className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-blue-300 items-right"
          >
            Next BGM ({track.index + 1}/{srcs.length}
            {shuffle ? ' shuffle' : ''})
          </button>
        </>
      )}
      <audio ref={slot0Ref} src={slotSrcs[0]}></audio>
      <audio ref={slot1Ref} src={slotSrcs[1]}></audio>
    </>
  )
}
