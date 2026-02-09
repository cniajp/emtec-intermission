'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Playlist } from '@/components/media/VideoPlaylist'

const VideoPlaylist = dynamic(
  () => import('../../components/media/VideoPlaylist')
)

const playlist: Playlist = [
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/m3.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/kagoya.mp4',
        type: 'video/mp4',
      },
    ],
  },
  // {
  //   sources: [
  //     {
  //       src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm4.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // },
  // {
  //   sources: [
  //     {
  //       src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // },
]

export default function Page() {
  return (
    <div>
      <h1>Video playlist</h1>
      <div className="w-[1280px] h-[720px]">
        <VideoPlaylist onEnded={() => {}} playlist={playlist} />
      </div>
    </div>
  )
}
