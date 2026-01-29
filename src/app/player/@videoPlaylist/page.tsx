'use client'

import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useContext } from 'react'
import { ContentContext } from '../context'
import { Playlist } from '../../../components/media/VideoPlaylist'

const VideoPlaylist = dynamic(() => import('../../../components/media/VideoPlaylist'))

const playlist: Playlist = [
  {
    sources: [
      {
        src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cnds2025/cm1.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cnds2025/cm2.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cnds2025/cm3.mp4',
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
  const { content, setContent } = useContext(ContentContext)

  return (
    <div className="w-[1280px] h-[720px]">
      <h1>Video playlist</h1>
      <p>
        複数のビデオを自動再生、最後のビデオが終わったら自動でアニメーションに切り替わる
      </p>
      <VideoPlaylist
        onEnded={() => {
          setContent('animation')
        }}
        playlist={playlist}
      />
      <p>
        次の finish
        をクリックすると、強制的にビデオを終了してアニメーションを再生
      </p>
      <button
        onClick={() => {
          setContent('animation')
        }}
      >
        finish
      </button>
    </div>
  )
}
