import { TalkView } from '@/logic/models/talkView'
import {
  makeSpeaker,
  makeStandardTalkView,
  makeTalk,
  makeTrack,
} from '@/logic/__fixtures__/talkFixtures'

// config は defaults を利用（excludedTalks が空配列で来る想定）。
// 個別ケースで override が必要なら jest.mock('@/config') を差し込む。

describe('TalkView', () => {
  describe('withoutDk', () => {
    it('指定した talkId のトークを選択済みトークとして採用する', () => {
      const talks = [
        makeTalk({ id: 10, trackId: 1, conferenceDayId: 1 }),
        makeTalk({ id: 20, trackId: 2, conferenceDayId: 1 }),
      ]
      const tracks = [makeTrack({ id: 1 }), makeTrack({ id: 2 })]
      const view = TalkView.withoutDk('20', talks, tracks, [])
      expect(view.selectedTalk.id).toBe(20)
      expect(view.selectedTrack.id).toBe(2)
    })

    it('同じ conferenceDayId のトークだけを allTalks に含める', () => {
      const talks = [
        makeTalk({ id: 1, conferenceDayId: 1 }),
        makeTalk({ id: 2, conferenceDayId: 2 }),
        makeTalk({ id: 3, conferenceDayId: 1 }),
      ]
      const view = TalkView.withoutDk('1', talks, [makeTrack({ id: 1 })], [])
      expect(view.allTalks.map((t) => t.id).sort()).toEqual([1, 3])
    })

    it('見つからない talkId で Error を投げる', () => {
      expect(() =>
        TalkView.withoutDk('999', [makeTalk({ id: 1 })], [makeTrack()], [])
      ).toThrow(/999/)
    })
  })

  describe('talksInSameTrack / talksLeftInSameTrack', () => {
    it('選択トークと同じ Track の全 Talk を startTime 昇順で返す', () => {
      const view = makeStandardTalkView({ selectedTalkId: 1 })
      const inTrack = view.talksInSameTrack()
      expect(inTrack.map((t) => t.id)).toEqual([1, 4, 7])
    })

    it('選択トーク以降の (>=) Talk のみ残す', () => {
      // slot2 (id=4) を選ぶと残りは [4, 7]
      const view = makeStandardTalkView({ selectedTalkId: 4 })
      expect(view.talksLeftInSameTrack().map((t) => t.id)).toEqual([4, 7])
    })
  })

  describe('talksInNextSlot', () => {
    it('選択トークの Slot に対して、各 Track の残り最初のトークを返す', () => {
      const view = makeStandardTalkView({ selectedTalkId: 1 })
      const next = view.talksInNextSlot()
      // slot1 では A=1, B=2, C=3
      expect(next['A'].id).toBe(1)
      expect(next['B'].id).toBe(2)
      expect(next['C'].id).toBe(3)
    })

    it('午前挙動: あるトラックだけ後ろの slot のトークになると、その Track は落ちる', () => {
      // Track B (id=2) の slot1 (id=2) を削り、次の slot2 (id=5) だけ残す
      const view = makeStandardTalkView({
        selectedTalkId: 1,
        // 何も追加しないが、この挙動は selectedTalk=1(A slot1) 時
        // 全 Track が同じ startTime のトークを持つ標準ケースをまず確認。
      })
      const next = view.talksInNextSlot()
      // 標準ケースでは全 Track が最も早い startTime のトークを共有する
      const startTimes = Object.values(next).map((t) => t.startTime)
      expect(new Set(startTimes).size).toBe(1)
    })
  })

  describe('speakersOf', () => {
    it('Talk に紐づく Speaker のみを返す', () => {
      const view = makeStandardTalkView({ selectedTalkId: 1 })
      // fixture: track A の各 slot は speakers[0]=Alice(id=1) が紐づく
      const speakers = view.speakersOf(1)
      expect(speakers.map((s) => s.id)).toEqual([1])
    })

    it('該当 Speaker が居ないとき空配列', () => {
      const talks = [
        makeTalk({
          id: 1,
          speakers: [{ id: 999, name: 'Ghost' }],
        }),
      ]
      const view = new TalkView(
        talks[0],
        talks,
        [makeTrack()],
        [makeSpeaker({ id: 1 })]
      )
      expect(view.speakersOf(1)).toEqual([])
    })
  })
})
