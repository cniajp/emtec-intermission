import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect } from 'react'
import { PageCtx } from '../models/pageContext'
import config from '@/config'
import type { Speaker, Talk, Track } from '@/data/types'
import PageHeader from './PageHeader'
import { getTimeStr } from '@/utils/time'
import { useAvatarSlider } from '../hooks/useAvatarSlider'
import { RollingAvatar } from '../avatar/RollingAvatar'

type PageProps = { view: Optional<TalkView>; isDk: boolean }
type Props = { view: Optional<TalkView> }

const DEFAULT_AVATAR =
  'https://www.janog.gr.jp/meeting/janog57/wp-content/uploads/2025/08/cropped-janog_logo_favicon_sq.png'

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  useEffect(() => {
    const cancel = setTimeout(goNextPage, config.transTimePage2 * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage])

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
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
          UPCOMING SESSIONS
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
  const { currentIndex, prevIndex, isSliding } = useAvatarSlider(
    speakers.length
  )

  if (!talk || !track) {
    return <></>
  }
  const companies = new Set(speakers.map((s) => s.company).filter(Boolean))
  const re = /(https:\/\/.*|\/.*)/

  const getAvatarUrl = (index: number) => {
    const speaker = speakers[index]
    return re.test(speaker?.avatarUrl || '') ? speaker.avatarUrl! : null
  }

  const currentAvatarUrl = getAvatarUrl(currentIndex)
  const prevAvatarUrl = getAvatarUrl(prevIndex)

  return (
    <div className="flex flex-row items-center text-gray-800 w-[900px] h-[300px] mt-12">
      <div className="basis-1/3 flex justify-end pr-5">
        <RollingAvatar
          currentSrc={currentAvatarUrl || DEFAULT_AVATAR}
          prevSrc={prevAvatarUrl || DEFAULT_AVATAR}
          isSliding={isSliding}
          defaultAvatar={DEFAULT_AVATAR}
        />
      </div>
      <div className="basis-2/3">
        {/* <div className="text-1.5xl my-2 w-[600px] text-black opacity-30 font-din-2014 font-bold "> */}
        <div className="text-1.5xl my-2 w-[600px] text-white opacity-90 font-din-2014 font-bold ">
          TRACK {track.name}
        </div>
        <div className="text-xl font-bold flex flex-wrap gap-x-1">
          {talk.speakers.map((s, i) => (
            <span key={i}>
              {s.name}
              {i < talk.speakers.length - 1 && ','}
            </span>
          ))}
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
        const avatarUrl = speakers[0]?.avatarUrl
        return avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            rel="preload"
            src={avatarUrl}
            alt="for preload"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR
            }}
          />
        ) : (
          <></>
        )
      })}
    </div>
  )
}
