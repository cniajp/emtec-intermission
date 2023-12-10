import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { PageCtx } from './models/pageContext'
import { useContext } from 'react'
import config from '@/config'
import { getTimeStr } from '@/utils/time'
import { trim } from '@/utils/utils'

type Props = { view: Optional<TalkView> }

export default function Header({ view }: Props) {
  const { now } = useContext(PageCtx)
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <div>No talks left.</div>
  }
  return (
    <div className="flex flex-row items-center h-[180px] text-white font-din-2014 font-bold">
      <div className="basis-1/3 ">
        <div className="text-base  text-center opacity-75">トラック</div>
        <div className="text-4xl  text-center font-video-cond">
          {view.selectedTrack.name}
        </div>
      </div>
      <div className="basis-1/3">
        <div className="text-lg text-center font-din-2014 opacity-75">
          {config.eventAbbr.toUpperCase()}
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
        <div className="text-base text-left mt-2">{trim(talk.title, 80)}</div>
      </div>
    </div>
  )
}
