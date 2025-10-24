import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext } from 'react'
import { PageCtx } from './models/pageContext'
import VideoPlaylist, { Playlist } from './VideoPlaylist'

type Props = { view: Optional<TalkView> }

// CM スポンサーがいない時には 各 source をコメントアウトする

const cmList: Record<string, { src: string; type: string }> = {
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

  const cmIds = view?.getCmIds()
  let cmids: string[]

  if (cmIds === undefined) {
    // undefined の場合: すべてのCMを再生
    cmids = Object.keys(cmList)
    console.log('CM IDs (undefined - using all):', cmids)
  } else if (cmIds.length === 0) {
    // 空配列の場合: CMをスキップして次のページへ
    console.log('CM IDs (empty - skipping):', cmIds)
    return goNextPage()
  } else {
    // 配列に値がある場合: 指定されたCMを再生
    cmids = cmIds
    console.log('CM IDs (specified):', cmids)
  }

  cmids.forEach((cmid) => {
    const cm = cmList[cmid]
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

  console.log('Page5 playlist:', playlist)

  return (
    <div className="w-full h-full">
      <VideoPlaylist onEnded={goNextPage} playlist={playlist}></VideoPlaylist>
    </div>
  )
}
