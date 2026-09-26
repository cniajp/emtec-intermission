import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'
import { now } from '@/utils/time'

function makeWrapper(goNextPage: jest.Mock, setPageEndsAt = jest.fn()) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
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
})
