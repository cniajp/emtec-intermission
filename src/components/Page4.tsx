import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext } from 'react'
import { PageCtx } from './models/pageContext'
import VideoPlaylist, { Playlist } from './VideoPlaylist'

type Props = { view: Optional<TalkView> }

// CM スポンサーがいない時には 各 source をコメントアウトする

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

export default function Page(_: Props) {
  const { goNextPage } = useContext(PageCtx)

  return (
    <div className="w-full h-full">
      <VideoPlaylist onEnded={goNextPage} playlist={playlist}></VideoPlaylist>
    </div>
  )
}
