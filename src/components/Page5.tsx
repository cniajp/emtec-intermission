import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext } from 'react'
import { PageCtx } from './models/pageContext'
import VideoPlaylist, { Playlist } from './VideoPlaylist'

type Props = { view: Optional<TalkView> }

// CM スポンサーがいない時には 各 source をコメントアウトする

const cmList = {
  cyberagent: {
    src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/cyberagent.mp4',
    type: 'video/mp4',
  },
  saasusplatform: {
    src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/o11ycon2025/saasusplatform.mp4',
    type: 'video/mp4',
  },
  monotaro1: {
    src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/monotaro1.mp4',
    type: 'video/mp4',
  },
  monotaro2: {
    src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/monotaro2.mp4',
    type: 'video/mp4',
  },
}

export default function Page({ view }: Props) {
  const { goNextPage } = useContext(PageCtx)
  const playlist: Playlist = []

  const cmids = view?.getCmIds() || []
  cmids.forEach((cmid) => {
    const cm = (cmList as Record<string, { src: string; type: string }>)[cmid]
    if (cm) {
      playlist.push({
        sources: [
          {
            src: cm.src,
            type: cm.type,
          },
        ],
      })
    }
  })

  return (
    <div className="w-full h-full">
      <VideoPlaylist onEnded={goNextPage} playlist={playlist}></VideoPlaylist>
    </div>
  )
}
