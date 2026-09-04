import config from '@/config'
import { useCallback, useEffect, useRef } from 'react'

type Props = {
  src: string
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

export default function AudioPlayer({ src, shouldPlay }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const log = (event: string) => (e?: Event) => {
      console.log(`[AudioPlayer] ${event}`, snapshot(el), e)
    }

    const handlers: Array<[keyof HTMLMediaElementEventMap, (e: Event) => void]> = [
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
      ['error', (e) => {
        console.error(`[AudioPlayer] error`, snapshot(el), e)
      }],
    ]
    handlers.forEach(([name, h]) => el.addEventListener(name, h))
    console.log(`[AudioPlayer] mount`, snapshot(el))

    return () => {
      handlers.forEach(([name, h]) => el.removeEventListener(name, h))
    }
  }, [])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    console.log(`[AudioPlayer] shouldPlay=${shouldPlay}`, snapshot(el))

    let cancelled = false
    let unarmFallback: (() => void) | null = null

    const armInteractionFallback = () => {
      if (unarmFallback) return
      console.log(`[AudioPlayer] arming interaction fallback`)
      const events: Array<keyof DocumentEventMap> = [
        'pointerdown',
        'keydown',
        'touchstart',
      ]
      const onInteract = () => {
        console.log(`[AudioPlayer] user interaction detected, retrying play()`)
        unarm()
        if (cancelled || !audioRef.current) return
        tryPlay()
      }
      const unarm = () => {
        events.forEach((name) =>
          document.removeEventListener(name, onInteract, true)
        )
        unarmFallback = null
      }
      events.forEach((name) =>
        document.addEventListener(name, onInteract, true)
      )
      unarmFallback = unarm
    }

    const tryPlay = () => {
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
          if (!cancelled && name === 'NotAllowedError') {
            armInteractionFallback()
          }
        })
      }
    }

    if (shouldPlay) {
      tryPlay()
    } else {
      el.pause()
    }

    return () => {
      cancelled = true
      if (unarmFallback) unarmFallback()
    }
  }, [shouldPlay])

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

  return (
    <>
      {config.debug && (
        <button
          onClick={play}
          className="font-bold py-0 px-4 mx-2 my-2 rounded-sm bg-blue-300 items-right"
        >
          Audio AutoPlay
        </button>
      )}
      <audio loop ref={audioRef} src={src}></audio>
    </>
  )
}
