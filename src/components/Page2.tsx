import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import type { Speaker, Talk, Track } from '@/data/types'
import PageHeader from './PageHeader'
import { getTimeStr } from '@/utils/time'

type Props = { view: Optional<TalkView> }

export default function Page({ view }: Props) {
  const { goNextPage } = useContext(PageCtx)
  useEffect(() => {
    const cancel = setTimeout(goNextPage, config.transTimePage2 * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage])

  return (
    <div>
      <PageHeader view={view} />
      <div className="h-full">
        <Body view={view} />
      </div>
    </div>
  )
}

function Body({ view }: Props) {
  if (!view) {
    return <></>
  }
  const nextTalks = view.talksInNextSlot()
  const talk = Object.values(nextTalks)[0]
  if (!talk) {
    return <></>
  }
  return (
    <div className=" mt-10 font-ryo-gothic-plusn">
      <div className="text-left w-[450px] bg-COLOR-UPCOMING-SESSION-LABEL pr-3 py-8">
        <div className="text-right text-white font-bold font-din-2014 tracking-wide text-1.5xl">
          UPCOMING SESSION
        </div>
        <div className="text-right text-white font-bold font-din-2014 text-1.5xl">
          {getTimeStr(talk.startTime)}-{getTimeStr(talk.endTime)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap8">
        {view.allTracks.map((track) => {
          const talk = nextTalks[track.name]
          if (!talk) {
            return <></>
          }
          const speakers = view.speakersOf(talk.id)
          return (
            <Track
              key={track.id}
              talk={talk}
              track={track}
              speakers={speakers}
            />
          )
        })}
      </div>
    </div>
  )
}

type TrackProps = {
  talk: Talk
  track: Track
  speakers: Speaker[]
}

function Track({ talk, track, speakers }: TrackProps) {
  if (!talk || !track) {
    return <></>
  }
  const companies = new Set(speakers.map((s) => s.company))
  const re = /(https:\/\/.*|\/.*)/
  const avatarUrl = re.test(speakers[0].avatarUrl || '')
    ? speakers[0].avatarUrl!
    : null
  return (
    <div className="flex flex-row items-center text-gray-800 w-[900px] h-[300px]">
      <div className="basis-1/3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={'avatar'}
            className="w-[180px] h-[180px] ml-auto mr-5 rounded-full"
          />
        ) : (
          <div className="w-[180px] h-[180px] ml-auto mr-5 rounded-full bg-gray-400 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{track.name}</span>
          </div>
        )}
      </div>
      <div className="basis-2/3">
        <div className="text-1.5xl my-2 w-[600px] text-black opacity-30 font-din-2014 font-bold ">
          TRACK {track.name}
        </div>
        <div className="text-xl font-bold">
          {talk.speakers.map((s) => s.name).join(', ')}
        </div>
        <div className="text-base mb-3">{Array.from(companies).join(', ')}</div>
        <div className="text-base my-3">{talk.title}</div>
      </div>
    </div>
  )
}

export function AvatarPreLoader({ view }: Props) {
  if (!view) {
    return <></>
  }
  const nextTalks = view.talksInNextSlot()
  const talk = Object.values(nextTalks)[0]
  if (!talk) {
    return <></>
  }
  return (
    <div className="hidden">
      {view.allTracks.map((track, i) => {
        const talk = nextTalks[track.name]
        if (!talk) {
          return <></>
        }
        const speakers = view.speakersOf(talk.id)
        const avatarUrl = speakers[0].avatarUrl
        return avatarUrl ? (
          <img key={i} rel="preload" src={avatarUrl} alt="for preload" />
        ) : (
          <></>
        )
      })}
    </div>
  )
}
