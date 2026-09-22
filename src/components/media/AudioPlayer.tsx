import config from '@/config'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  // 順に再生し、末尾まで来たら先頭に戻る。空なら何も描画しない
  srcs: ReadonlyArray<string>
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

// 現在の曲。gen は「同じ index でも再生し直す」ためのカウンタ（1 曲構成で先頭に戻るとき用）
type Track = { index: number; gen: number }

export default function AudioPlayer({ srcs, shouldPlay }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [track, setTrack] = useState<Track>({ index: 0, gen: 0 })
  // 直前に再生 effect を通った track.gen。曲送りで gen が変わったのに src が同じなら
  // （1 曲構成でのループ）currentTime を 0 に戻す。shouldPlay の切替だけなら続きから再開する
  const lastPlayedGenRef = useRef<number>(-1)
  // 自動再生が拒否されたときのフォールバック解除関数
  const unarmFallbackRef = useRef<(() => void) | null>(null)
  // フォールバックのリスナから最新の tryPlay を呼ぶための参照
  const tryPlayRef = useRef<() => void>(() => {})

  const src = srcs[track.index] ?? srcs[0]

  const goNextTrack = useCallback(() => {
    setTrack((t) => ({ index: (t.index + 1) % srcs.length, gen: t.gen + 1 }))
  }, [srcs.length])

  // 曲送りと shouldPlay 切替の両方から使う play()。
  // NotAllowedError（自動再生ポリシー）のときは、次のユーザー操作で再試行する。
  const tryPlay = useCallback(() => {
    const el = audioRef.current
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
        if (!audioRef.current) return
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
  }, [])
  useEffect(() => {
    tryPlayRef.current = tryPlay
  }, [tryPlay])

  // 診断ログ
  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const log = (event: string) => (e?: Event) => {
      console.log(`[AudioPlayer] ${event}`, snapshot(el), e)
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
          console.error(`[AudioPlayer] error`, snapshot(el), e)
        },
      ],
    ]
    handlers.forEach(([name, h]) => el.addEventListener(name, h))
    console.log(`[AudioPlayer] mount`, snapshot(el))

    return () => {
      handlers.forEach(([name, h]) => el.removeEventListener(name, h))
    }
  }, [])

  // 曲が終わったら次へ（loop 属性は付けない。付けると ended が発火しない）
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    el.addEventListener('ended', goNextTrack)
    return () => el.removeEventListener('ended', goNextTrack)
  }, [goNextTrack])

  // 再生・停止。shouldPlay の切替と曲送り（track）の両方で走る
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    console.log(
      `[AudioPlayer] shouldPlay=${shouldPlay} track=${track.index}`,
      snapshot(el)
    )

    if (!shouldPlay) {
      el.pause()
      return
    }
    const isTrackAdvance =
      lastPlayedGenRef.current !== -1 && lastPlayedGenRef.current !== track.gen
    if (isTrackAdvance && el.currentSrc.endsWith(src)) {
      // 同じ曲を最初から（1 曲構成でのループ）
      el.currentTime = 0
    }
    lastPlayedGenRef.current = track.gen
    tryPlay()

    return () => {
      if (unarmFallbackRef.current) unarmFallbackRef.current()
    }
  }, [shouldPlay, track, src, tryPlay])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    console.log(`[AudioPlayer] src changed -> ${src}`, snapshot(el))
  }, [src])

  const play = useCallback(() => {
    const el = audioRef.current
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
  }, [])

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
            Next BGM ({track.index + 1}/{srcs.length})
          </button>
        </>
      )}
      <audio ref={audioRef} src={src}></audio>
    </>
  )
}
