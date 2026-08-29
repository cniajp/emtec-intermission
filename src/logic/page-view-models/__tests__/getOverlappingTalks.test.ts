import { TalkView } from '@/logic/models/talkView'
import { getOverlappingTalks } from '@/logic/page-view-models/getOverlappingTalks'
import {
  makeSpeaker,
  makeTalk,
  makeTrack,
} from '@/logic/__fixtures__/talkFixtures'

describe('getOverlappingTalks', () => {
  it('選択スロットの時間帯に重なるトークを各 Track ごとに拾う', () => {
    const tracks = [
      makeTrack({ id: 1, name: 'A' }),
      makeTrack({ id: 2, name: 'B' }),
    ]
    const talks = [
      // A: 10:00-10:30
      makeTalk({
        id: 1,
        trackId: 1,
        startTime: '2026-08-29T10:00:00+09:00',
        endTime: '2026-08-29T10:30:00+09:00',
      }),
      // B: 10:10-10:40 (A のスロットに重なる)
      makeTalk({
        id: 2,
        trackId: 2,
        startTime: '2026-08-29T10:10:00+09:00',
        endTime: '2026-08-29T10:40:00+09:00',
      }),
    ]
    const view = new TalkView(talks[0], talks, tracks, [makeSpeaker()])
    const overlap = getOverlappingTalks(view)
    expect(overlap['A'].id).toBe(1)
    expect(overlap['B'].id).toBe(2)
  })

  it('重ならないが 30 分以内に開始するトークをフォールバックで拾う', () => {
    const tracks = [
      makeTrack({ id: 1, name: 'A' }),
      makeTrack({ id: 2, name: 'B' }),
    ]
    const talks = [
      // A: 10:00-10:30
      makeTalk({
        id: 1,
        trackId: 1,
        startTime: '2026-08-29T10:00:00+09:00',
        endTime: '2026-08-29T10:30:00+09:00',
      }),
      // B: 10:45 開始 → 30分延長 (11:00) に間に合う
      makeTalk({
        id: 2,
        trackId: 2,
        startTime: '2026-08-29T10:45:00+09:00',
        endTime: '2026-08-29T11:15:00+09:00',
      }),
    ]
    const view = new TalkView(talks[0], talks, tracks, [makeSpeaker()])
    const overlap = getOverlappingTalks(view)
    expect(overlap['A'].id).toBe(1)
    expect(overlap['B'].id).toBe(2)
  })

  it('30 分以上先にしか開始しない Track は結果に含まれない', () => {
    const tracks = [
      makeTrack({ id: 1, name: 'A' }),
      makeTrack({ id: 2, name: 'B' }),
    ]
    const talks = [
      makeTalk({
        id: 1,
        trackId: 1,
        startTime: '2026-08-29T10:00:00+09:00',
        endTime: '2026-08-29T10:30:00+09:00',
      }),
      // B: 12:00 開始 → 除外
      makeTalk({
        id: 2,
        trackId: 2,
        startTime: '2026-08-29T12:00:00+09:00',
        endTime: '2026-08-29T12:30:00+09:00',
      }),
    ]
    const view = new TalkView(talks[0], talks, tracks, [makeSpeaker()])
    const overlap = getOverlappingTalks(view)
    expect(overlap['A'].id).toBe(1)
    expect(overlap['B']).toBeUndefined()
  })

  it('baseTalk が無い場合は空の nextTalks をそのまま返す', () => {
    // showOnTimetable=false のみ = talksInNextSlot が空を返すケース
    const tracks = [makeTrack({ id: 1, name: 'A' })]
    const talks = [
      makeTalk({
        id: 1,
        trackId: 1,
        showOnTimetable: false,
      }),
    ]
    const view = new TalkView(talks[0], talks, tracks, [])
    const result = getOverlappingTalks(view)
    expect(result).toEqual({})
  })
})
