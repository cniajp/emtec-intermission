/* eslint-disable */
'use client'

import config from '@/config'
import React, { useRef, useEffect } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const videojsPlaylistPlugin = require('videojs-playlist')
console.log('plugin', videojsPlaylistPlugin)

export type Playlist = {
  sources: {
    src: string
    type: string
  }[]
}[]

type Props = {
  onEnded: () => void
  playlist: Playlist
}

export default function VideoPlaylist({ onEnded, playlist }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    const player: any = videojs(videoRef.current, {})
    playerRef.current = player
    console.log('player', player)

    player.playlist(playlist)
    console.log(player.playlist())

    player.on('ended', () => {
      if (player.playlist.next() === undefined) {
        onEnded()
      }
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
      }
    }
  }, [])

  // Autoplay の設定、muted じゃないと正しく動かない場合もありそう。
  // 事前に手動で再生していたりするとうまくいくとの情報も。
  // Ref: https://developer.chrome.com/blog/autoplay/
  return (
    <video
      autoPlay
      {...(config.debug && { controls: true })}
      ref={videoRef}
      className="video-js w-full h-full"
    />
  )
}
