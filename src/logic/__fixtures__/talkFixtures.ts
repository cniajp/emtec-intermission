import type { Speaker, Talk, Track } from '@/data/types'
import { TalkView } from '@/logic/models/talkView'

// タイムゾーンは +09:00 固定（TalkView 内部の getTime() が dayjs.tz を使うため）。
export const makeTalk = (overrides: Partial<Talk> = {}): Talk => ({
  id: 1,
  trackId: 1,
  title: 'Sample Talk',
  abstract: 'sample abstract',
  speakers: [],
  startTime: '2026-08-29T10:00:00+09:00',
  endTime: '2026-08-29T10:30:00+09:00',
  conferenceDayId: 1,
  showOnTimetable: true,
  ...overrides,
})

export const makeTrack = (overrides: Partial<Track> = {}): Track => ({
  id: 1,
  name: 'A',
  ...overrides,
})

export const makeSpeaker = (overrides: Partial<Speaker> = {}): Speaker => ({
  id: 1,
  name: 'Alice',
  company: 'Acme',
  avatarUrl: 'https://example.com/alice.png',
  ...overrides,
})

/**
 * Day1, 3トラック(A/B/C), 各 3 スロット(10:00, 10:40, 11:20 開始)の
 * 標準サンプル TalkView を作る。selectedTalkId 未指定なら Track A の最初のトーク。
 */
export function makeStandardTalkView(opts?: {
  selectedTalkId?: number
  extraTalks?: Talk[]
}): TalkView {
  const tracks: Track[] = [
    makeTrack({ id: 1, name: 'A' }),
    makeTrack({ id: 2, name: 'B' }),
    makeTrack({ id: 3, name: 'C' }),
  ]
  const speakers: Speaker[] = [
    makeSpeaker({ id: 1, name: 'Alice' }),
    makeSpeaker({ id: 2, name: 'Bob' }),
    makeSpeaker({ id: 3, name: 'Carol' }),
  ]
  const slots = [
    { start: '2026-08-29T10:00:00+09:00', end: '2026-08-29T10:30:00+09:00' },
    { start: '2026-08-29T10:40:00+09:00', end: '2026-08-29T11:10:00+09:00' },
    { start: '2026-08-29T11:20:00+09:00', end: '2026-08-29T11:50:00+09:00' },
  ]
  const talks: Talk[] = []
  let id = 1
  slots.forEach((slot, slotIdx) => {
    tracks.forEach((track, trackIdx) => {
      talks.push(
        makeTalk({
          id: id++,
          trackId: track.id,
          title: `Track${track.name} Slot${slotIdx + 1}`,
          startTime: slot.start,
          endTime: slot.end,
          speakers: [
            { id: speakers[trackIdx].id, name: speakers[trackIdx].name },
          ],
        })
      )
    })
  })
  const extras = opts?.extraTalks ?? []
  const allTalks = [...talks, ...extras]
  const selectedId = opts?.selectedTalkId ?? 1
  const selected = allTalks.find((t) => t.id === selectedId)
  if (!selected) {
    throw new Error(`fixture: talk ${selectedId} not found`)
  }
  return new TalkView(selected, allTalks, tracks, speakers)
}
