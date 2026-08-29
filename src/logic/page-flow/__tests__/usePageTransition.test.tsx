import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'
import { pushPageEvent } from '@/lib/faro'
import { now } from '@/utils/time'

jest.mock('@/lib/faro')

function makeWrapper(goNextPage: jest.Mock) {
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
        }}
      >
        {children}
      </PageCtx.Provider>
    )
  }
}

describe('useTimedPageTransition', () => {
  it('N秒経過で page_exit を発火し goNextPage を呼ぶ', () => {
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
    expect(pushPageEvent).toHaveBeenCalledWith('Page1', 'page_exit')
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
})
