import { TalkView } from '@/logic/models/talkView'
import config from '@/config'
import type { Talk } from '@/data/types'
import { getTime } from '@/utils/time'

export type LaterTalksOptions = {
  // 次の枠にトークが無いトラックにも、時間が近い後続のトークを出すか
  showLaterTalks: boolean
  // 基準トークの終了から何分先までに始まるトークを出すか（0 なら重なるものだけ）
  laterTalksWithinMinutes: number
}

// Page2 に出すトークを各トラックごとに取得する。
// 次の枠のトークに加えて、options.showLaterTalks が true なら時間が近い後続のトークも拾う
// （brand.page2 をそのまま渡せる）
export function getOverlappingTalks(
  view: TalkView,
  options: LaterTalksOptions
): Record<string, Talk> {
  const nextTalks = view.talksInNextSlot()
  const baseTalk = Object.values(nextTalks)[0]
  if (!baseTalk || !options.showLaterTalks) {
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

    // 重なるトークがない場合、さらに laterTalksWithinMinutes 分先まで検索
    const extendedSlotEnd = slotEnd.add(
      Math.max(0, options.laterTalksWithinMinutes),
      'minute'
    )
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
