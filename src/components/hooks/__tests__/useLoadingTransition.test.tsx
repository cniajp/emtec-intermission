import { act, renderHook } from '@testing-library/react'
import {
  LOGO_FADE_IN_MS,
  LOGO_FADE_OUT_MS,
  useLoadingTransition,
} from '@/components/hooks/useLoadingTransition'

type Options = Parameters<typeof useLoadingTransition>[0]

function setup(initial: Options) {
  return renderHook((props: Options) => useLoadingTransition(props), {
    initialProps: initial,
  })
}

const advance = (ms: number) =>
  act(() => {
    jest.advanceTimersByTime(ms)
  })

describe('useLoadingTransition', () => {
  it('ロゴのフェードイン → フェードアウトの後にコンテンツを表示する', () => {
    jest.useFakeTimers()
    const { result } = setup({ isDataReady: true })

    advance(LOGO_FADE_IN_MS - 1)
    expect(result.current.isLogoFadingOut).toBe(false)
    advance(1)
    expect(result.current.isLogoFadingOut).toBe(true)
    expect(result.current.showContent).toBe(false)

    advance(LOGO_FADE_OUT_MS)
    expect(result.current.showContent).toBe(true)
    expect(result.current.isLoading).toBe(true)
    advance(100)
    expect(result.current.isLoading).toBe(false)
  })

  it('画像・フォントの準備ができるまではローディングを続ける', () => {
    jest.useFakeTimers()
    const { result, rerender } = setup({
      isDataReady: true,
      isAssetsReady: false,
    })

    advance(LOGO_FADE_IN_MS + 3000)
    expect(result.current.isLogoFadingOut).toBe(false)
    expect(result.current.showContent).toBe(false)

    rerender({ isDataReady: true, isAssetsReady: true })
    expect(result.current.isLogoFadingOut).toBe(true)
    advance(LOGO_FADE_OUT_MS)
    expect(result.current.showContent).toBe(true)
  })

  it('準備が先に終わっていても、ロゴのフェードインが終わるまでは待つ', () => {
    jest.useFakeTimers()
    const { result } = setup({ isDataReady: true, isAssetsReady: true })

    advance(LOGO_FADE_IN_MS - 1)
    expect(result.current.isLogoFadingOut).toBe(false)
  })

  it('forceAnimation でデータがまだ無いときは、準備を待たずに進む', () => {
    jest.useFakeTimers()
    const { result } = setup({
      isDataReady: false,
      forceAnimation: true,
      isAssetsReady: false,
    })

    advance(LOGO_FADE_IN_MS)
    expect(result.current.isLogoFadingOut).toBe(true)
    advance(LOGO_FADE_OUT_MS)
    expect(result.current.showContent).toBe(true)
  })

  it('データが無く読み込み中でもなければ、すぐにコンテンツを表示する', () => {
    const { result } = setup({ isDataReady: false, isDataLoading: false })
    expect(result.current.showContent).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('データの読み込み中はローディングのまま待つ', () => {
    jest.useFakeTimers()
    const { result } = setup({ isDataReady: false, isDataLoading: true })
    advance(10_000)
    expect(result.current.showContent).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })
})
