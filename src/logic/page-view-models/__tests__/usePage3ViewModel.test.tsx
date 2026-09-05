import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import config, { extendConfig } from '@/config'
import { BrandProvider } from '@/brand/BrandProvider'
import type { Brand } from '@/brand/types'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { usePage3ViewModel } from '@/logic/page-view-models/usePage3ViewModel'
import { makeBrand } from '@/logic/__fixtures__/brandFixtures'
import {
  makeStandardTalkView,
  makeTalk,
  makeTrack,
} from '@/logic/__fixtures__/talkFixtures'
import { TalkView } from '@/logic/models/talkView'
import { now } from '@/utils/time'

jest.mock('@/lib/faro')

function makeWrapper(brand: Brand, goNextPage: jest.Mock) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <BrandProvider brand={brand}>
        <PageCtx.Provider
          value={{
            current: 0,
            totalPage: 4,
            goNextPage,
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
}

describe('usePage3ViewModel', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    // extendConfig は module スコープの config を直接書き換えるので後始末する
    delete config.transTimePage3
  })

  it('画像が空なら isEmpty=true で即 goNextPage', () => {
    const goNextPage = jest.fn()
    const brand = makeBrand({ images: [] })
    const view = makeStandardTalkView({ selectedTalkId: 1 })
    const { result } = renderHook(() => usePage3ViewModel(view), {
      wrapper: makeWrapper(brand, goNextPage),
    })
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.currentImageSrc).toBeNull()
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })

  it('画像あり: alias 付きの最初の URL を返し、1枚あたり secondsPerImage 秒で次の画像へ、全消化後に goNextPage', () => {
    const goNextPage = jest.fn()
    const brand = makeBrand({
      alias: 'kinoko2026/info',
      images: ['a.jpg', 'b.jpg'],
      secondsPerImage: 10,
    })
    const view = makeStandardTalkView({ selectedTalkId: 1 })
    const { result } = renderHook(() => usePage3ViewModel(view), {
      wrapper: makeWrapper(brand, goNextPage),
    })

    expect(result.current.isEmpty).toBe(false)
    expect(result.current.currentImageSrc).toBe('/kinoko2026/info/a.jpg')
    expect(goNextPage).not.toHaveBeenCalled()

    // interval = secondsPerImage（枚数に依らず1枚あたり固定）
    const intervalMs = brand.page3.secondsPerImage * 1000
    act(() => {
      jest.advanceTimersByTime(intervalMs)
    })
    expect(result.current.currentImageSrc).toBe('/kinoko2026/info/b.jpg')

    // 更に advance → count >= length で goNextPage
    act(() => {
      jest.advanceTimersByTime(intervalMs)
    })
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })

  it('config.transTimePage3 が設定されていれば brand の secondsPerImage より優先される', () => {
    extendConfig({ transTimePage3: '3' })
    const goNextPage = jest.fn()
    const brand = makeBrand({
      alias: 'ev',
      images: ['a.jpg', 'b.jpg'],
      secondsPerImage: 10,
    })
    const view = makeStandardTalkView({ selectedTalkId: 1 })
    const { result } = renderHook(() => usePage3ViewModel(view), {
      wrapper: makeWrapper(brand, goNextPage),
    })

    expect(result.current.currentImageSrc).toBe('/ev/a.jpg')
    act(() => {
      jest.advanceTimersByTime(3 * 1000)
    })
    expect(result.current.currentImageSrc).toBe('/ev/b.jpg')
  })

  it('選択トークの trackId に対応する trackImages を挿入する', () => {
    const goNextPage = jest.fn()
    const brand = makeBrand({
      alias: 'ev',
      images: ['a.jpg', 'b.jpg'],
      trackImages: { 2: [{ position: 2, src: 'x.jpg' }] },
    })
    // Track B (id=2) のトークを選択
    const view = new TalkView(
      makeTalk({ id: 5, trackId: 2 }),
      [makeTalk({ id: 5, trackId: 2 })],
      [makeTrack({ id: 2, name: 'B' })],
      []
    )
    const { result } = renderHook(() => usePage3ViewModel(view), {
      wrapper: makeWrapper(brand, goNextPage),
    })
    // buildPage3Images(['a','b'], [{pos:2, src:'x'}]) = ['a','x','b'] → 先頭は 'a'
    expect(result.current.currentImageSrc).toBe('/ev/a.jpg')
  })
})
