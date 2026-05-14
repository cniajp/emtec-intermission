import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useRef } from 'react'
import { PageCtx } from '../models/pageContext'
import config from '@/config'
import { staticConfig } from '@/staticConfig'
import type { Speaker, Talk, Track } from '@/data/types'
import PageHeader from './PageHeader'
import { getTime, getTimeStr } from '@/utils/time'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'
import {
  useAvatarSlider,
  ANIMATION_DURATION_SEC,
} from '../hooks/useAvatarSlider'
import { RollingAvatar } from '../avatar/RollingAvatar'

// 選択されたトークの時間帯に重なるトークを各トラックごとに取得
function getOverlappingTalks(view: TalkView): Record<string, Talk> {
  const nextTalks = view.talksInNextSlot()
  const baseTalk = Object.values(nextTalks)[0]
  if (!baseTalk) {
    return nextTalks
  }

  const slotStart = getTime(baseTalk.startTime)
  const slotEnd = getTime(baseTalk.endTime)

  const result: Record<string, Talk> = {}

  // 対象トラックの残りトークを取得するヘルパー
  const getTracksRemainingTalks = (trackId: number) => {
    return view.allTalks
      .filter(
        (talk) =>
          talk.trackId === trackId &&
          talk.showOnTimetable &&
          !config.excludedTalks.includes(talk.id)
      )
      .filter((talk) => {
        const talkStart = getTime(talk.startTime)
        return talkStart >= getTime(view.selectedTalk.startTime)
      })
      .sort((a, b) => getTime(a.startTime).diff(getTime(b.startTime)))
  }

  view.allTracks.forEach((track) => {
    // 既に nextTalks にあればそれを使う
    if (nextTalks[track.name]) {
      result[track.name] = nextTalks[track.name]
      return
    }

    const remainingTalks = getTracksRemainingTalks(track.id)

    // 時間が重なるトークを探す
    const overlappingTalk = remainingTalks.filter((talk) => {
      const talkStart = getTime(talk.startTime)
      const talkEnd = getTime(talk.endTime)
      // 時間が重なる条件
      return talkStart.isBefore(slotEnd) && talkEnd.isAfter(slotStart)
    })[0]

    if (overlappingTalk) {
      result[track.name] = overlappingTalk
      return
    }

    // 重なるトークがない場合、さらに30分先まで検索
    const extendedSlotEnd = slotEnd.add(30, 'minute')
    const extendedOverlappingTalk = remainingTalks.filter((talk) => {
      const talkStart = getTime(talk.startTime)
      const talkEnd = getTime(talk.endTime)
      return talkStart.isBefore(extendedSlotEnd) && talkEnd.isAfter(slotStart)
    })[0]

    if (extendedOverlappingTalk) {
      result[track.name] = extendedOverlappingTalk
    }
  })

  return result
}

type PageProps = { view: Optional<TalkView>; isDk: boolean }
type Props = { view: Optional<TalkView> }

const DEFAULT_AVATAR = (isDk: boolean) =>
  isDk
    ? staticConfig.breakDk.base.defaultAvatarSrc
    : staticConfig.break.base.defaultAvatarSrc

const TRACK_BG_COLORS = ['#861117', '#548A8A', '#CAA85B']

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
        {view.allTracks.map((track, i) => {
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

function Track({ talk, track, speakers, isDk, bgColor }: TrackProps) {
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

export function AvatarPreLoader({ view, isDk }: PageProps) {
  if (!view) {
    return <></>
  }
  const nextTalks = getOverlappingTalks(view)
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
              e.currentTarget.src = DEFAULT_AVATAR(isDk)
            }}
          />
        ) : (
          <></>
        )
      })}
    </div>
  )
}
