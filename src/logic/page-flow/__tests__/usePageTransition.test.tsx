import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { PageRunningCtx } from '@/logic/page-flow/PageRunningContext'
import { PageCtx } from '@/logic/page-flow/PageContext'
import {
  PAGE_EXIT_MS,
  useTimedPageTransition,
} from '@/logic/page-flow/usePageTransition'

function makeWrapper(goNextPage: jest.Mock, setPageEndsAt = jest.fn()) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <PageCtx.Provider
        value={{
          current: 0,
          totalPage: 4,
          goNextPage,
          setTotalPage: jest.fn(),
          isNextVideoAvailable: false,
          registerNextVideo: jest.fn(),
          invokeNextVideo: jest.fn(),
          pageEndsAt: null,
          setPageEndsAt,
        }}
      >
        {children}
      </PageCtx.Provider>
    )
  }
}

describe('useTimedPageTransition', () => {
  it('N秒経過で goNextPage を呼ぶ', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    renderHook(() => useTimedPageTransition('Page1', 5), {
      wrapper: makeWrapper(goNextPage),
    })

    expect(goNextPage).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(4999)
    })
    expect(goNextPage).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })

  it('unmount 時に setTimeout をクリアする (goNextPage が呼ばれない)', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    const { unmount } = renderHook(() => useTimedPageTransition('Page2', 5), {
      wrapper: makeWrapper(goNextPage),
    })

    unmount()
    act(() => {
      jest.advanceTimersByTime(10_000)
    })
    expect(goNextPage).not.toHaveBeenCalled()
  })

  it('終了予定時刻（N秒後）を知らせ、unmount で取り消す', () => {
    jest.useFakeTimers()
    const setPageEndsAt = jest.fn()
    const before = performance.now()
    const { unmount } = renderHook(() => useTimedPageTransition('Page1', 5), {
      wrapper: makeWrapper(jest.fn(), setPageEndsAt),
    })

    expect(setPageEndsAt).toHaveBeenCalledTimes(1)
    const endsAt = setPageEndsAt.mock.calls[0][0] as number
    expect(endsAt - before).toBeGreaterThanOrEqual(5000)
    expect(endsAt - before).toBeLessThan(5100)

    unmount()
    expect(setPageEndsAt).toHaveBeenLastCalledWith(null)
  })

  it('ローディング中（PageRunningCtx が false）は数え始めず、表示が始まってから N 秒で遷移する', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    const setPageEndsAt = jest.fn()
    const Inner = makeWrapper(goNextPage, setPageEndsAt)
    let running = false
    const { rerender } = renderHook(() => useTimedPageTransition('Page1', 5), {
      wrapper: ({ children }: PropsWithChildren) => (
        <PageRunningCtx.Provider value={running}>
          <Inner>{children}</Inner>
        </PageRunningCtx.Provider>
      ),
    })

    act(() => {
      jest.advanceTimersByTime(10_000)
    })
    expect(goNextPage).not.toHaveBeenCalled()
    expect(setPageEndsAt).not.toHaveBeenCalled()

    running = true
    rerender()
    expect(setPageEndsAt).toHaveBeenCalledTimes(1)
    act(() => {
      jest.advanceTimersByTime(4999)
    })
    expect(goNextPage).not.toHaveBeenCalled()
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })

  it('切り替わる PAGE_EXIT_MS 前から isLeaving が true になる', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    const { result } = renderHook(() => useTimedPageTransition('Page1', 5), {
      wrapper: makeWrapper(goNextPage),
    })
    expect(result.current.isLeaving).toBe(false)

    act(() => {
      jest.advanceTimersByTime(5000 - PAGE_EXIT_MS - 1)
    })
    expect(result.current.isLeaving).toBe(false)

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current.isLeaving).toBe(true)
    expect(goNextPage).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(PAGE_EXIT_MS)
    })
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })

  it('表示時間が退場より短いページでは isLeaving にならずに遷移する', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    const { result } = renderHook(
      () => useTimedPageTransition('Page1', PAGE_EXIT_MS / 1000 / 2),
      { wrapper: makeWrapper(goNextPage) }
    )

    act(() => {
      jest.advanceTimersByTime(PAGE_EXIT_MS / 2 - 1)
    })
    expect(result.current.isLeaving).toBe(false)
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })
})
