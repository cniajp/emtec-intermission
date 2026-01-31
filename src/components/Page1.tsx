import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect, useRef } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import { getTimeStr } from '@/utils/time'
import { trim } from '@/utils/utils'
import PageHeader from './PageHeader'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'

type PageProps = { view: Optional<TalkView>; isDk: boolean }
type Props = { view: Optional<TalkView> }

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
          <div className="basis-2/3">
            <Body view={view} />
          </div>
          <div className="basis-1/3">
            <Side view={view} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Body({ view }: Props) {
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <></>
  }
  const speakers = view.speakersOf(talk.id)
  const companies = new Set(speakers.map((s) => s.company))

  return (
    <div className="my-20">
      <div className="text-left w-[450px] bg-COLOR-UPCOMING-SESSION-LABEL pr-3 py-8">
        <div className="text-right text-white font-bold font-din-2014 tracking-wide text-1.5xl">
          UPCOMING SESSION
        </div>
      </div>
      <div className="top-[80px] left-[120px] w-[850px] relative longshadow">
        <div className="text-center py-1 text-xl text-white bg-slate-400 font-din-2014 font-light">
          {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
        </div>
        <div className="mx-10 my-5 font-ryo-gothic-plusn">
          <div className="text-center text-2xl mt-8 mb-5 font-bold">
            {talk.title}
          </div>
          <div className="text-center text-lg font-bold m-3">
            {talk.speakers.map((s) => s.name).join(', ')}
          </div>
          <div className="text-center text-lg font-bold m-3">
            {Array.from(companies).join(', ')}
          </div>
        </div>
        <div className="m-5 py-5 font-ryo-gothic-plusn">
          <div className="text-sm text-gray-600 ">
            {talk.talkCategory && (
              <span className="mr-5">Category: {talk.talkCategory}</span>
            )}
            {talk.talkDifficulty && (
              <span className="mr-5">Difficulty: {talk.talkDifficulty}</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {talk.abstract && <span>Abstract: {trim(talk.abstract, 200)}</span>}
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
