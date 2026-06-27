import { Optional } from '@/utils/types'
import { TalkView } from '../../models/talkView'
import { getTimeStr } from '@/utils/time'

type Props = { view: Optional<TalkView>; isDk?: boolean }

export function Side({ view }: Props) {
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
