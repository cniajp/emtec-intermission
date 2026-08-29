/* eslint-disable */
'use client'

import config from '@/config'
import React, { useRef, useEffect, useContext } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { PageCtx } from '@/logic/page-flow/PageContext'
import type { Playlist } from './playlist'

export { type Playlist, toPlaylist } from './playlist'

const videojsPlaylistPlugin = require('videojs-playlist')
console.log('plugin', videojsPlaylistPlugin)

type Props = {
  onEnded: () => void
  playlist: Playlist
}

export default function VideoPlaylist({ onEnded, playlist }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const { registerNextVideo } = useContext(PageCtx)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    // fill: true は必須。これを外すと video.js は寸法を実行時に計算して
    // `.vjs_video_N-dimensions` として注入する方式になり、初期描画で親より小さい
    // サイズ（1280x720 など）が出てから非同期に補正される。
    // Tailwind v4 のユーティリティは @layer utilities に入る一方、video-js.css は
    // JS import でレイヤ外に注入されるため、`.video-js{width:300px;height:150px}` が
    // `.w-full`/`.h-full` に無条件で勝つ。つまり className では寸法を制御できない。
    // fill: true なら video-js.css 自身の
    // `.video-js.vjs-fill{width:100%;height:100%}`（レイヤ外・詳細度も上）が効く。
    const player: any = videojs(videoRef.current, { fill: true })
    playerRef.current = player
    console.log('player', player)

    player.playlist(playlist)
    console.log(player.playlist())

    player.on('ended', () => {
      if (player.playlist.next() === undefined) {
        onEnded()
      }
    })

    registerNextVideo(() => {
      if (playerRef.current?.playlist?.next?.() === undefined) {
        onEnded()
      }
    })

    return () => {
      registerNextVideo(null)
      if (playerRef.current) {
        playerRef.current.dispose()
      }
    }
  }, [])

  // Autoplay の設定、muted じゃないと正しく動かない場合もありそう。
  // 事前に手動で再生していたりするとうまくいくとの情報も。
  // Ref: https://developer.chrome.com/blog/autoplay/
  return (
    // 寸法は videojs の fill オプションが持つ。ここに w-full / h-full を足しても
    // Tailwind のユーティリティはレイヤ外の video-js.css に負けるので効かない。
    // `video-js` クラスは video.js が必要とするので消さないこと。
    <video
      autoPlay
      {...(config.debug && { controls: true })}
      ref={videoRef}
      className="video-js"
    />
  )
}
