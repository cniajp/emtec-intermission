import config from '@/config'
import { useCallback, useEffect, useRef } from 'react'

type Props = {
  src: string
  shouldPlay: boolean
}

export default function AudioPlayer({ src, shouldPlay }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!audioRef.current) {
      return
    }
    if (shouldPlay) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [shouldPlay])

  const play = useCallback(() => {
    if (!audioRef.current) {
      return
    }
    audioRef.current.load()
    audioRef.current.play()
  }, [])

  return (
    <>
      {config.debug && (
        <button
          onClick={play}
          className="font-bold py-0 px-4 mx-2 my-2 rounded bg-blue-300 items-right"
        >
          Audio AutoPlay
        </button>
      )}
      <audio loop ref={audioRef} src={src}></audio>
    </>
  )
}
