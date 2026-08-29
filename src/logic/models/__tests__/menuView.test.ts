import { MenuView } from '@/logic/models/talkView'
import {
  makeSpeaker,
  makeTalk,
  makeTrack,
} from '@/logic/__fixtures__/talkFixtures'

describe('MenuView', () => {
  it('withoutDk: 指定 dayId のトークのみを持つ MenuView を返す', () => {
    const talks = [
      makeTalk({ id: 1, conferenceDayId: 1 }),
      makeTalk({ id: 2, conferenceDayId: 2 }),
      makeTalk({ id: 3, conferenceDayId: 1 }),
    ]
    const view = MenuView.withoutDk('1', talks, [makeTrack()], [])
    expect(view.allTalks.map((t) => t.id).sort()).toEqual([1, 3])
  })

  describe('timeSlots', () => {
    it('startTime のユニーク集合を昇順で返す', () => {
      const talks = [
        makeTalk({
          id: 1,
          startTime: '2026-08-29T11:00:00+09:00',
          endTime: '2026-08-29T11:30:00+09:00',
        }),
        makeTalk({
          id: 2,
          startTime: '2026-08-29T10:00:00+09:00',
          endTime: '2026-08-29T10:30:00+09:00',
        }),
        makeTalk({
          id: 3,
          // id=1 と同じ startTime → 重複排除
          startTime: '2026-08-29T11:00:00+09:00',
          endTime: '2026-08-29T11:30:00+09:00',
        }),
      ]
      const view = new MenuView(talks, [makeTrack()], [])
      const slots = view.timeSlots()
      expect(slots.length).toBe(2)
      expect(slots[0].startTime).toBe('2026-08-29T10:00:00+09:00')
      expect(slots[1].startTime).toBe('2026-08-29T11:00:00+09:00')
    })
  })

  describe('getTalksOnTimeSlot', () => {
    it('トラック順に対応するトークを埋め、欠けは null', () => {
      const tracks = [
        makeTrack({ id: 1, name: 'A' }),
        makeTrack({ id: 2, name: 'B' }),
        makeTrack({ id: 3, name: 'C' }),
      ]
      const talks = [
        makeTalk({
          id: 1,
          trackId: 1,
          startTime: '2026-08-29T10:00:00+09:00',
          endTime: '2026-08-29T10:30:00+09:00',
        }),
        // Track B は 10:00 に無し
        makeTalk({
          id: 3,
          trackId: 3,
          startTime: '2026-08-29T10:00:00+09:00',
          endTime: '2026-08-29T10:30:00+09:00',
        }),
      ]
      const view = new MenuView(talks, tracks, [])
      const row = view.getTalksOnTimeSlot({
        startTime: '2026-08-29T10:00:00+09:00',
        endTime: '2026-08-29T10:30:00+09:00',
      })
      expect(row.map((t) => t?.id ?? null)).toEqual([1, null, 3])
    })

    it('startTime が違うトークは同スロットに入らない (endTime が違っても start 一致だけ拾う)', () => {
      const view = new MenuView(
        [
          makeTalk({
            id: 1,
            startTime: '2026-08-29T10:00:00+09:00',
            endTime: '2026-08-29T10:30:00+09:00',
          }),
          makeTalk({
            id: 2,
            startTime: '2026-08-29T10:00:00+09:00',
            // 終了時刻だけ違う
            endTime: '2026-08-29T10:45:00+09:00',
          }),
          makeTalk({
            id: 3,
            startTime: '2026-08-29T10:15:00+09:00',
            endTime: '2026-08-29T10:30:00+09:00',
          }),
        ],
        [makeTrack({ id: 1 })],
        []
      )
      const row = view.getTalksOnTimeSlot({
        startTime: '2026-08-29T10:00:00+09:00',
        endTime: '2026-08-29T10:30:00+09:00',
      })
      // 最後に talk id=2 が上書きするため (2 が拾われる)
      expect(row[0]?.id).toBe(2)
    })

    // makeSpeaker はここで使わないが fixture の export が壊れていないか確認する。
    it('sanity: speaker fixture が使える', () => {
      expect(makeSpeaker().id).toBe(1)
    })
  })
})
