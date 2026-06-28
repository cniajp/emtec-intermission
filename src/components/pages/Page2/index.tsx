import { Optional } from '@/utils/types'
import { TalkView } from '../../models/talkView'
import { useContext, useEffect, useRef } from 'react'
import { PageCtx } from '../../models/pageContext'
import config from '@/config'
import { staticConfig } from '@/staticConfig'
import type { Speaker, Talk, Track } from '@/data/types'
import PageHeader from '../PageHeader'
import { getTimeStr } from '@/utils/time'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'
import {
  useAvatarSlider,
  ANIMATION_DURATION_SEC,
} from '../../hooks/useAvatarSlider'
import { RollingAvatar } from '../../avatar/RollingAvatar'
import { getOverlappingTalks } from './getOverlappingTalks'

export { AvatarPreLoader } from './AvatarPreLoader'
export { Page3ImagePreLoader } from './Page3ImagePreLoader'

type PageProps = { view: Optional<TalkView>; isDk: boolean }

const DEFAULT_AVATAR = (isDk: boolean) =>
  isDk
    ? staticConfig.breakDk.base.defaultAvatarSrc
    : staticConfig.break.base.defaultAvatarSrc

const TRACK_BG_COLORS = ['#f14e35', '#387c61', '#e5b73d']

// TODO: kinoko2026 一時対応 - オープニング/hacomono体操の時間帯は並行セッションがないため他トラックを非表示にする
const HIDE_OTHER_TRACKS_TALK_IDS = [9001, 9002]

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  const renderStartTime = useRef(performance.now())

  useEffect(() => {
    const duration = performance.now() - renderStartTime.current
    pushPageMeasurement('Page2', duration)
    pushPageEvent('Page2', 'page_displayed')

    const cancel = setTimeout(() => {
      pushPageEvent('Page2', 'page_exit')
      goNextPage()
    }, config.transTimePage2 * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage])

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
      <div className="h-full">
        <Body view={view} isDk={isDk} />
      </div>
    </div>
  )
}

function Body({ view, isDk }: PageProps) {
  if (!view) {
    return <></>
  }
  const nextTalks = getOverlappingTalks(view)
  const talk = Object.values(nextTalks)[0]
  if (!talk) {
    return <></>
  }

  const hideOtherTracks = HIDE_OTHER_TRACKS_TALK_IDS.includes(
    view.selectedTalk.id
  )
  const tracksToShow = hideOtherTracks
    ? view.allTracks.filter((t) => t.id === view.selectedTalk.trackId)
    : view.allTracks

  return (
    <div className=" mt-10 font-ryo-gothic-plusn">
      <div className="text-left w-[450px] pr-10 py-10 bg-[url('/cnk2026/background.jpg')] bg-cover bg-center rounded-r-2xl">
        <div className="text-right text-[#1E1E1E] font-bold font-din-2014 tracking-wide text-1.5xl">
          UPCOMING SESSIONS
        </div>
        <div className="text-right text-[#1E1E1E] font-bold font-din-2014 text-1.5xl">
          {getTimeStr(talk.startTime)}-{getTimeStr(talk.endTime)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 justify-items-center">
        {tracksToShow.map((track, i) => {
          const talk = nextTalks[track.name]
          if (!talk) {
            return <></>
          }
          const speakers = view.speakersOf(talk.id)
          return (
            <TrackRow
              key={track.id}
              talk={talk}
              track={track}
              speakers={speakers}
              isDk={isDk}
              bgColor={TRACK_BG_COLORS[i % TRACK_BG_COLORS.length]}
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
  isDk: boolean
  bgColor: string
}

function TrackRow({ talk, track, speakers, isDk, bgColor }: TrackProps) {
  const { currentIndex, prevIndex, isSliding } = useAvatarSlider(
    speakers.length
  )

  if (!talk || !track) {
    return <></>
  }
  const re = /(https:\/\/.*|\/.*)/

  const getAvatarUrl = (index: number) => {
    const speaker = speakers[index]
    return re.test(speaker?.avatarUrl || '') ? speaker.avatarUrl! : null
  }

  const currentAvatarUrl = getAvatarUrl(currentIndex)
  const prevAvatarUrl = getAvatarUrl(prevIndex)
  const currentSpeaker = speakers[currentIndex]

  return (
    <div className="relative flex flex-row items-center w-[900px] h-[300px] mt-12 backdrop-blur-xl bg-white/30 border border-white/30 rounded-2xl shadow-2xl text-[#1E1E1E] p-6">
      <span
        className="absolute top-3 left-4 inline-block px-3 py-1 rounded-full text-sm uppercase tracking-widest font-din-2014 font-bold text-white"
        style={{ backgroundColor: bgColor }}
      >
        TRACK {track.name}
      </span>
      <div className="basis-1/3 flex justify-center">
        <RollingAvatar
          currentSrc={currentAvatarUrl || DEFAULT_AVATAR(isDk)}
          prevSrc={prevAvatarUrl || DEFAULT_AVATAR(isDk)}
          isSliding={isSliding}
          defaultAvatar={DEFAULT_AVATAR(isDk)}
          size={180}
        />
      </div>
      <div className="basis-2/3 pl-4">
        <div
          key={`name-${currentIndex}`}
          className="text-2xl font-bold mb-2 speaker-fade"
        >
          {currentSpeaker?.name}
        </div>
        <div
          key={`company-${currentIndex}`}
          className="text-base font-semibold mb-4 text-[#1E1E1E]/60 speaker-fade"
        >
          {currentSpeaker?.company}
        </div>
        <div className="text-lg font-semibold leading-relaxed line-clamp-3">
          {talk.title}
        </div>
      </div>
      <style jsx>{`
        .speaker-fade {
          animation: speakerFadeIn ${ANIMATION_DURATION_SEC}
            cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes speakerFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
