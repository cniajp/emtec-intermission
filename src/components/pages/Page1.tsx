import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useRef, useState } from 'react'
import { PageCtx } from '../models/pageContext'
import config from '@/config'
import { getTimeStr } from '@/utils/time'
import { trim } from '@/utils/utils'
import PageHeader from './PageHeader'
import { Speaker } from '@/data/types'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'

type PageProps = { view: Optional<TalkView>; isDk: boolean }
type Props = { view: Optional<TalkView>; isDk?: boolean }

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  const renderStartTime = useRef(performance.now())

  useEffect(() => {
    const duration = performance.now() - renderStartTime.current
    pushPageMeasurement('Page1', duration)
    pushPageEvent('Page1', 'page_displayed')

    const cancel = setTimeout(() => {
      pushPageEvent('Page1', 'page_exit')
      goNextPage()
    }, config.transTimePage1 * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage])

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
      <div className="h-full">
        <div className="flex flex-row h-full">
          <div className="basis-3/5">
            <Main view={view} isDk={isDk} />
          </div>
          <div className="basis-2/5">
            <Side view={view} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Main({ view, isDk }: Props) {
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <></>
  }
  const speakers = view.speakersOf(talk.id)

  return (
    <div className="mt-4 mb-16">
      <div className="text-left w-[500px] pr-10 py-10 bg-[url('/cnk2026/background.jpg')] bg-cover bg-center rounded-r-2xl">
        <div className="text-right text-[#1E1E1E] font-bold font-din-2014 tracking-wide text-2xl">
          UPCOMING SESSION
        </div>
      </div>
      <div className="top-[55px] left-[120px] w-[1000px] relative longshadow bg-[#548A8A] text-white rounded-lg">
        <div className="text-center py-2 text-2xl text-white bg-[#1E1E1E] font-din-2014 font-medium rounded-t-lg">
          {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
        </div>
        <div className="h-[208px] px-12 py-6 w-full font-ryo-gothic-plusn flex items-center justify-center">
          <div className="text-center text-3xl font-bold break-words line-clamp-3">
            {talk.title}
          </div>
        </div>
        <SpeakerCards speakers={speakers} />
        <div className="p-6 font-ryo-gothic-plusn text-white">
          {(talk.talkCategory || talk.talkDifficulty) && (
            <div className="text-base text-gray-300 pb-2">
              {talk.talkCategory && (
                <span className="mr-5">Category: {talk.talkCategory}</span>
              )}
              {talk.talkDifficulty && (
                <span className="mr-5">Difficulty: {talk.talkDifficulty}</span>
              )}
            </div>
          )}
          <div className="text-base text-white line-clamp-4">
            {talk.abstract && (
              <span>
                {isDk && 'Abstract: '}
                {talk.abstract}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Side({ view }: Props) {
  if (!view) {
    return <></>
  }
  // 現在のトークより前のものは表示しない
  const talkStartTime = view.talksLeftInSameTrack()[0]?.startTime
  if (!talkStartTime) {
    return <></>
  }
  // 午前セッションは、keynoteとして1枠で表示する。
  const hasKeynote =
    view
      .talksInSameTrack()
      .filter(
        (t) => t.talkCategory === 'Keynote' && t.startTime > talkStartTime
      ).length > 0
  const talks = view
    .talksInSameTrack()
    .filter((t) => t.talkCategory !== 'Keynote' && t.startTime > talkStartTime)
  const keyNoteTalks = view
    .talksInSameTrack()
    .filter((t) => t.talkCategory === 'Keynote' && t.startTime > talkStartTime)
  const MAX_VISIBLE_CARDS = 4
  const visibleTalks = talks.slice(
    0,
    hasKeynote ? MAX_VISIBLE_CARDS - 1 : MAX_VISIBLE_CARDS
  )
  return (
    <div className="p-14 h-[940px] text-[#1E1E1E] overflow-hidden flex-col justify-start items-end gap-4 inline-flex">
      {hasKeynote && (
        <div className="text-right w-[650px] h-[170px] backdrop-blur-xl bg-white/30 border border-white/20 px-4 pt-2 pb-3 my-3 font-ryo-gothic-plusn rounded-xl shadow-lg">
          <div className="flex flex-row">
            <div className="text-left basis-1/2 text-base font-din-2014 font-light">
              <span>
                {getTimeStr(keyNoteTalks[0].startTime)} -{' '}
                {getTimeStr(keyNoteTalks[keyNoteTalks.length - 1].endTime)} :
              </span>
              <span className="ml-2">Keynote</span>
            </div>
            <div className="basis-1/2 text-base" />
          </div>
          {keyNoteTalks.map((talk) => (
            <div
              key={talk.id}
              className="text-center text-lg min-h-[40px] py-1 font-bold line-clamp-3"
            >
              {talk.title}
            </div>
          ))}
        </div>
      )}

      {visibleTalks.map((talk) => (
        <div
          key={talk.id}
          className="flex flex-col text-right w-[650px] h-[170px] backdrop-blur-xl bg-white/50 border border-white/20 px-4 pt-3 pb-2 my-3 font-ryo-gothic-plusn rounded-xl shadow-lg"
        >
          <div className="flex flex-row">
            <div className="text-left basis-1/2 text-base font-din-2014 font-light">
              {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
            </div>
            <div className="basis-1/2 text-base">
              {talk.speakers.map((t) => t.name).join(', ')}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-center text-lg font-bold line-clamp-3">
            {talk.title}
          </div>
        </div>
      ))}
    </div>
  )
}

const DEFAULT_AVATAR =
  'https://www.janog.gr.jp/meeting/janog57/wp-content/uploads/2025/08/cropped-janog_logo_favicon_sq.png'

function SpeakerCards({ speakers }: { speakers: Speaker[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflow, setIsOverflow] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (container && content) {
      setIsOverflow(content.scrollWidth > container.clientWidth)
    }
  }, [speakers])

  if (speakers.length === 0) return null

  const cardElements = speakers.map((s, i) => (
    <div
      key={i}
      className="shrink-0 mx-4 flex flex-col items-center min-w-[140px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.avatarUrl || DEFAULT_AVATAR}
        alt={s.name}
        className="rounded-full object-cover border-4 border-white/40 shadow-xl mb-3"
        style={{ width: 100, height: 100 }}
        onError={(e) => {
          e.currentTarget.src = DEFAULT_AVATAR
        }}
      />
      <div className="text-white text-lg font-bold text-center leading-tight">
        {s.name}
      </div>
      {s.company && (
        <div className="text-white/80 text-sm text-center mt-1 leading-tight">
          {s.company}
        </div>
      )}
    </div>
  ))

  return (
    <div ref={containerRef} className="overflow-hidden w-full py-4">
      <div
        ref={contentRef}
        className={`flex ${isOverflow ? '' : 'justify-center'}`}
        style={
          isOverflow
            ? {
                animation: 'sushiLane 25s linear infinite',
                width: 'max-content',
              }
            : undefined
        }
      >
        {cardElements}
        {isOverflow && cardElements}
        {isOverflow && cardElements}
      </div>
      {isOverflow && (
        <style jsx>{`
          @keyframes sushiLane {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
        `}</style>
      )}
    </div>
  )
}
