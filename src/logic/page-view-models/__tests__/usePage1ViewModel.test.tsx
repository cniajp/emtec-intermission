import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import config from '@/config'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { usePage1ViewModel } from '@/logic/page-view-models/usePage1ViewModel'
import { pushPageEvent, pushPageMeasurement } from '@/lib/faro'
import { now } from '@/utils/time'

jest.mock('@/lib/faro')

function wrapper(goNextPage: jest.Mock) {
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

describe('usePage1ViewModel', () => {
  it('マウント時に telemetry を発火し config.transTimePage1 秒経過で遷移する', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    renderHook(() => usePage1ViewModel(), { wrapper: wrapper(goNextPage) })

    expect(pushPageMeasurement).toHaveBeenCalledWith(
      'Page1',
      expect.any(Number)
    )
    expect(pushPageEvent).toHaveBeenCalledWith('Page1', 'page_displayed')

    act(() => {
      jest.advanceTimersByTime(config.transTimePage1 * 1000)
    })
    expect(pushPageEvent).toHaveBeenCalledWith('Page1', 'page_exit')
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })
})
