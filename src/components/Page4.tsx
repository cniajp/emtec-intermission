import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext } from 'react'
import { PageCtx } from './models/pageContext'
import VideoPlaylist from './VideoPlaylist'
import { VIDEO_PLAYLIST } from '@/constants/video-config'

type Props = { view: Optional<TalkView> }

export default function Page(_: Props) {
  const { goNextPage } = useContext(PageCtx)

  return (
    <div className="w-full h-full">
      <VideoPlaylist
        onEnded={goNextPage}
        playlist={VIDEO_PLAYLIST}
      ></VideoPlaylist>
    </div>
  )
}
