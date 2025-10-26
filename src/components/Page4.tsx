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
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/3shake.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/antipattern.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/datadog.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/grafana.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/kaonavi.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/mackerel.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/newrelic.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/pagerduty.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/shift.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/splunk.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/topotal.mp4',
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

  return (
    <div className="w-full h-full">
      <VideoPlaylist onEnded={goNextPage} playlist={playlist}></VideoPlaylist>
    </div>
  )
}
