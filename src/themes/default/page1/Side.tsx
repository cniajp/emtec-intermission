import { Optional } from '@/utils/types'
import { TalkView } from '@/logic/models/talkView'
import { getTimeStr } from '@/utils/time'
import { summarizeSpeakerNames } from '@/utils/utils'
import { CancelledBadge } from '../CancelledBadge'
import { motion } from '../motion'

type Props = { view: Optional<TalkView>; isLeaving: boolean }

export function Side({ view, isLeaving }: Props) {
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
        <div
          className={`text-right w-[650px] h-[170px] backdrop-blur-xl bg-white/75 border border-white/40 px-4 pt-2 pb-3 my-3 font-ryo-gothic-plusn rounded-xl shadow-lg ${motion('right', isLeaving, 0).className}`}
          style={motion('right', isLeaving, 0).style}
        >
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

      {visibleTalks.map((talk, i) => {
        // カードは右から、上のものから順に入る
        const m = motion('right', isLeaving, (hasKeynote ? 1 : 0) + i)
        return (
          <div
            key={talk.id}
            className={`flex flex-col text-right w-[650px] h-[170px] backdrop-blur-xl bg-white/85 border border-white/40 px-4 pt-3 pb-2 my-3 font-ryo-gothic-plusn rounded-xl shadow-lg ${m.className}`}
            style={m.style}
          >
            <div className="flex flex-row">
              <div className="text-left shrink-0 pr-4 text-base font-din-2014 font-light">
                {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
                {talk.cancelled && <CancelledBadge className="ml-3 text-sm" />}
              </div>
              {/* 折り返すとタイトル領域を押し潰すので 1 行に固定する */}
              <div className="flex-1 min-w-0 text-base truncate">
                {summarizeSpeakerNames(talk.speakers.map((t) => t.name))}
              </div>
            </div>
            <div
              className={`flex-1 min-h-0 flex items-center justify-center text-center text-lg font-bold ${talk.cancelled ? 'line-through opacity-60' : ''}`}
            >
              {/* line-clamp は display を上書きするので、中央寄せの flex とは別要素に付ける */}
              <span className="line-clamp-3">{talk.title}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
