import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect, useRef, useState } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import { getTimeStr } from '@/utils/time'
import { trim } from '@/utils/utils'
import PageHeader from './PageHeader'
import Image from 'next/image'
import { Speaker } from '@/data/types'

type PageProps = { view: Optional<TalkView>; isDk: boolean }
type Props = { view: Optional<TalkView>; isDk?: boolean }

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  useEffect(() => {
    const cancel = setTimeout(goNextPage, config.transTimePage1 * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage])

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
      <div className="h-full">
        <div className="flex flex-row h-full">
          <div className="basis-2/3">
            <Main view={view} isDk={isDk} />
          </div>
          <div className="basis-1/3">
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
  const companies = new Set(speakers.map((s) => s.company).filter(Boolean))

  return (
    <div className="my-20">
      <div className="text-left w-[450px] bg-COLOR-UPCOMING-SESSION-LABEL pr-3 py-8">
        <div className="text-right text-white font-bold font-din-2014 tracking-wide text-1.5xl">
          UPCOMING SESSION
        </div>
      </div>
      <div className="top-[80px] left-[120px] w-[850px] relative longshadow bg-[rgba(18,151,204,0.9)] text-white">
        <div className="text-center py-1 text-xl text-white bg-slate-400 font-din-2014 font-light">
          {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
        </div>
        <div className="px-10 py-5 w-full font-ryo-gothic-plusn">
          <div className="text-center text-2xl pt-8 pb-5 font-bold">
            {talk.title}
          </div>
          <div className="text-lg font-bold p-3 flex flex-wrap justify-center gap-x-1">
            {talk.speakers.map((s, i) => (
              <span key={i}>
                {s.name}
                {i < talk.speakers.length - 1 && ','}
              </span>
            ))}
          </div>
          {companies.size > 0 && (
            <div className="text-center text-lg font-bold p-3">
              {Array.from(companies).join(', ')}
            </div>
          )}
        </div>
        <SpeakerAvatars speakers={speakers} />
        <div className="p-5 font-ryo-gothic-plusn text-white">
          {(talk.talkCategory || talk.talkDifficulty) && (
            <div className="text-sm text-gray-600 pb-2">
              {talk.talkCategory && (
                <span className="mr-5">Category: {talk.talkCategory}</span>
              )}
              {talk.talkDifficulty && (
                <span className="mr-5">Difficulty: {talk.talkDifficulty}</span>
              )}
            </div>
          )}
          {/* <div className="text-sm text-gray-600"> */}
          <div className="text-sm text-white">
            {talk.abstract && (
              <span>
                {isDk && 'Abstract: '}
                {trim(talk.abstract, 200)}
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
  return (
    <div className="p-14 h-[80%] overflow-y-auto hidden-scrollbar">
      {hasKeynote && (
        <div className="text-right w-[750px] bg-COLOR-TIMETABLE-Box px-3 pt-1 pb-2 my-3 font-ryo-gothic-plusn">
          <div className="flex flex-row">
            <div className="text-left basis-1/2 text-white text-xxs font-din-2014 font-light">
              <span>
                {getTimeStr(keyNoteTalks[0].startTime)} -{' '}
                {getTimeStr(keyNoteTalks[keyNoteTalks.length - 1].endTime)} :
              </span>
              <span className="ml-2">Keynote</span>
            </div>
            <div className="basis-1/2 text-white text-xxs" />
          </div>
          {keyNoteTalks.map((talk) => (
            <div
              key={talk.id}
              className="text-center text-white text-semi h-min-[30px] font-bold"
            >
              {trim(talk.title, 80)}
            </div>
          ))}
        </div>
      )}

      {talks.map((talk) => (
        <div
          key={talk.id}
          className="text-right w-[750px] bg-COLOR-TIMETABLE-Box px-3 pt-2 my-3 font-ryo-gothic-plusn"
        >
          <div className="flex flex-row">
            <div className="text-left basis-1/2 text-white text-xxs font-din-2014 font-light">
              {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
            </div>
            <div className="basis-1/2 text-white text-xxs">
              {talk.speakers.map((t) => t.name).join(', ')}
            </div>
          </div>
          <div className="text-center text-white text-semi h-[60px] font-bold">
            {trim(talk.title, 80)}
          </div>
        </div>
      ))}
    </div>
  )
}

const DEFAULT_AVATAR =
  'https://www.janog.gr.jp/meeting/janog57/wp-content/uploads/2025/08/cropped-janog_logo_favicon_sq.png'

function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className="rounded-full mx-2 mb-4 shrink-0"
      width={96}
      height={96}
      onError={() => setImgSrc(DEFAULT_AVATAR)}
    />
  )
}

function SpeakerAvatars({ speakers }: { speakers: Speaker[] }) {
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

  const avatarElements = speakers.map((s, i) => (
    <AvatarImage key={i} src={s.avatarUrl || ''} alt={s.name} />
  ))

  return (
    <div ref={containerRef} className="overflow-hidden w-full">
      <div
        ref={contentRef}
        className={`flex justify-center gap-x-1 ${isOverflow ? 'animate-marquee' : ''}`}
        style={
          isOverflow
            ? {
                animation: 'marquee 20s linear infinite',
                width: 'max-content',
              }
            : undefined
        }
      >
        {avatarElements}
        {isOverflow && avatarElements}
      </div>
      {isOverflow && (
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      )}
    </div>
  )
}
