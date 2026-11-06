import { act, renderHook } from '@testing-library/react'
import { TalkView } from '@/logic/models/talkView'
import { useSameStartRotation } from '@/logic/page-view-models/useSameStartRotation'
import {
  makeSpeaker,
  makeTalk,
  makeTrack,
} from '@/logic/__fixtures__/talkFixtures'

// Track A: 09:30 のトーク → 10:00 開始が3本(10:00 の先頭を選択) → 11:00 開始が1本
function makeView() {
  const tracks = [makeTrack({ id: 1, name: 'A' })]
  const at = (h: string) => `2026-08-29T${h}:00+09:00`
  const talks = [
    makeTalk({ id: 1, startTime: at('09:30'), endTime: at('09:50') }),
    makeTalk({ id: 11, startTime: at('10:00'), endTime: at('11:00') }),
    makeTalk({ id: 12, startTime: at('10:00'), endTime: at('11:00') }),
    makeTalk({ id: 13, startTime: at('10:00'), endTime: at('11:00') }),
    makeTalk({ id: 21, startTime: at('11:00'), endTime: at('12:00') }),
  ]
  return new TalkView(talks[1], talks, tracks, [makeSpeaker()])
}

const firstId = (v: TalkView | null | undefined) =>
  v?.talksLeftInSameTrack()[0]?.id

describe('TalkView の同時刻トークの切り替え', () => {
  it('rotation に応じて同時刻のトーク群の先頭が入れ替わり、後続は変わらない', () => {
    const view = makeView()
    expect(view.sameStartCountInTrack(1)).toBe(3)
    expect(view.talksLeftInSameTrack().map((t) => t.id)).toEqual([
      11, 12, 13, 21,
    ])
    expect(
      view
        .withRotation(1)
        .talksLeftInSameTrack()
        .map((t) => t.id)
    ).toEqual([12, 13, 11, 21])
    expect(view.withRotation(2).talksInNextSlot()['A'].id).toBe(13)
  })
})

describe('useSameStartRotation', () => {
  beforeEach(() => jest.useFakeTimers())

  it('表示時間を本数で等分して順番に切り替える', () => {
    const view = makeView()
    const { result } = renderHook(() => useSameStartRotation(view, 30, [1]))
    expect(firstId(result.current)).toBe(11)
    act(() => jest.advanceTimersByTime(10_000))
    expect(firstId(result.current)).toBe(12)
    act(() => jest.advanceTimersByTime(10_000))
    expect(firstId(result.current)).toBe(13)
    act(() => jest.advanceTimersByTime(10_000))
    expect(firstId(result.current)).toBe(11)
  })

  it('同時刻が1本だけなら元の view をそのまま返す', () => {
    const tracks = [makeTrack({ id: 1, name: 'A' })]
    const talks = [makeTalk({ id: 1 })]
    const view = new TalkView(talks[0], talks, tracks, [makeSpeaker()])
    const { result } = renderHook(() => useSameStartRotation(view, 30, [1]))
    expect(result.current).toBe(view)
  })
})
