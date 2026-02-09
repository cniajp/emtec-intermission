import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useRef } from 'react'
import { PageCtx } from '../models/pageContext'
import VideoPlaylist, { Playlist } from '../media/VideoPlaylist'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'

type Props = { view: Optional<TalkView> }

// CM スポンサーがいない時には 各 source をコメントアウトする

const playlist: Playlist = [
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/srekaigi2026/makuai.mp4',
        type: 'video/mp4',
      },
    ],
  },
  // {
  //   sources: [
  //     {
  //       src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // },
]

export default function Page(_: Props) {
  const { goNextPage } = useContext(PageCtx)
  const renderStartTime = useRef(performance.now())

  useEffect(() => {
    const duration = performance.now() - renderStartTime.current
    pushPageMeasurement('Page4', duration)
    pushPageEvent('Page4', 'page_displayed')
  }, [])

  const handleEnded = () => {
    pushPageEvent('Page4', 'page_exit')
    goNextPage()
  }

  return (
    <div className="w-full h-full">
      <VideoPlaylist onEnded={handleEnded} playlist={playlist}></VideoPlaylist>
    </div>
  )
}
