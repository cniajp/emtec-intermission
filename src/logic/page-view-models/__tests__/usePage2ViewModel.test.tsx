import { renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { BrandProvider } from '@/brand/BrandProvider'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { usePage2ViewModel } from '@/logic/page-view-models/usePage2ViewModel'
import { makeBrand } from '@/logic/__fixtures__/brandFixtures'
import {
  makeSpeaker,
  makeStandardTalkView,
  makeTalk,
  makeTrack,
} from '@/logic/__fixtures__/talkFixtures'
import { TalkView } from '@/logic/models/talkView'
import { now } from '@/utils/time'

jest.mock('@/lib/faro')

function wrapper({ children }: PropsWithChildren) {
  return (
    <BrandProvider brand={makeBrand()}>
      <PageCtx.Provider
        value={{
          current: 0,
          totalPage: 4,
          goNextPage: jest.fn(),
          setTotalPage: jest.fn(),
          now: now(),
          hasTimeDrift: false,
          isNextVideoAvailable: false,
          registerNextVideo: jest.fn(),
          invokeNextVideo: jest.fn(),
        }}
      >
        {children}
      </PageCtx.Provider>
    </BrandProvider>
  )
}

describe('usePage2ViewModel', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('view=null なら timeRange=null / rows=[]', () => {
    const { result } = renderHook(() => usePage2ViewModel(null), { wrapper })
    expect(result.current.timeRange).toBeNull()
    expect(result.current.rows).toEqual([])
  })

  it('通常時: 全 Track 分の rows を trackIndex 付きで返す', () => {
    const view = makeStandardTalkView({ selectedTalkId: 1 })
    const { result } = renderHook(() => usePage2ViewModel(view), { wrapper })
    expect(result.current.rows.length).toBe(3)
    expect(result.current.rows.map((r) => r.track.name)).toEqual([
      'A',
      'B',
      'C',
    ])
    expect(result.current.rows.map((r) => r.trackIndex)).toEqual([0, 1, 2])
    expect(result.current.timeRange).toEqual({
      start: '2026-08-29T10:00:00+09:00',
      end: '2026-08-29T10:30:00+09:00',
    })
  })

  it('選択トークが HIDE_OTHER_TRACKS_TALK_IDS (9001) の場合、そのトラックだけになる', () => {
    // fixture の selected talk を id=9001, trackId=2 (Track B) に置き換える
    const specialTalk = makeTalk({
      id: 9001,
      trackId: 2,
      startTime: '2026-08-29T10:00:00+09:00',
      endTime: '2026-08-29T10:30:00+09:00',
    })
    const tracks = [
      makeTrack({ id: 1, name: 'A' }),
      makeTrack({ id: 2, name: 'B' }),
      makeTrack({ id: 3, name: 'C' }),
    ]
    const talks = [
      makeTalk({ id: 1, trackId: 1 }),
      specialTalk,
      makeTalk({ id: 3, trackId: 3 }),
    ]
    const view = new TalkView(specialTalk, talks, tracks, [makeSpeaker()])

    const { result } = renderHook(() => usePage2ViewModel(view), { wrapper })
    expect(result.current.rows.length).toBe(1)
    expect(result.current.rows[0].track.name).toBe('B')
  })
})
