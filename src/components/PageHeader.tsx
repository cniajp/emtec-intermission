import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { PageCtx } from './models/pageContext'
import { useContext } from 'react'
import config from '@/config'
import { getTimeStr } from '@/utils/time'
import { trim } from '@/utils/utils'

type Props = { view: Optional<TalkView>; isDk: boolean }

export default function Header({ view, isDk }: Props) {
  const { now } = useContext(PageCtx)
  const { eventAbbr, dkEventAbbr } = config
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <div>No talks left.</div>
  }
  const eventAbbrToShow = isDk ? dkEventAbbr : eventAbbr
  if (!eventAbbrToShow) {
    return <div>No eventAbbr configured.</div>
  }
  return (
    <div className="flex flex-row items-center h-[140px] text-white font-din-2014 font-bold">
      <div className="pl-30 basis-3/12 ">
        <div className="text-base  text-center opacity-75 font-ryo-gothic-plusn">
          トラック
        </div>
        <div className="text-4xl  text-center font-video-cond">
          {view.selectedTrack.name}
        </div>
      </div>

      <div className=" basis-2/12 ">
        <div className="text-base  text-left opacity-75 font-ryo-gothic-plusn">
          ハッシュタグ
        </div>
        <div className="text-2xl text-left font-din-2014">
          {view.selectedTrack.hashTag ? (
            <>
              #{eventAbbrToShow.toUpperCase()}
              <br />#{view.selectedTrack.hashTag.toUpperCase()}
            </>
          ) : (
            <>
              {/* #{eventAbbrToShow.toUpperCase()}_{view.selectedTrack.name} */}
              #{eventAbbrToShow.toUpperCase()}
            </>
          )}
        </div>
      </div>
      <div className="basis-1/4">
        <div className="text-lg text-center font-din-2014 opacity-75">
          {eventAbbrToShow.toUpperCase()}
        </div>
        <div className="text-5xl text-center font-video-cond">
          {now.format('HH:mm:ss')}
        </div>
      </div>
      <div className="basis-1/12">
        <div className="text-lg text-center opacity-75 font-video-cond">
          NEXT
        </div>
      </div>
      <div className="basis-1/4 pr-4">
        <div className="text-lg text-left">
          {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
        </div>
        <div className="text-base text-left mt-2 font-ryo-gothic-plusn line-clamp-3">
          {trim(talk.title, 80)}
        </div>
      </div>
    </div>
  )
}
