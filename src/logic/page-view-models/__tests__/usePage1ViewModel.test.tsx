import { act, renderHook } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { BrandProvider } from '@/brand/BrandProvider'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { usePage1ViewModel } from '@/logic/page-view-models/usePage1ViewModel'
import { makeBrand } from '@/logic/__fixtures__/brandFixtures'
import { pushPageEvent, pushPageMeasurement } from '@/lib/faro'
import { now } from '@/utils/time'

jest.mock('@/lib/faro')

const brand = makeBrand()

function wrapper(goNextPage: jest.Mock) {
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

describe('usePage1ViewModel', () => {
  it('マウント時に telemetry を発火し brand.page1.seconds 秒経過で遷移する', () => {
    jest.useFakeTimers()
    const goNextPage = jest.fn()
    renderHook(() => usePage1ViewModel(), { wrapper: wrapper(goNextPage) })

    expect(pushPageMeasurement).toHaveBeenCalledWith(
      'Page1',
      expect.any(Number)
    )
    expect(pushPageEvent).toHaveBeenCalledWith('Page1', 'page_displayed')

    act(() => {
      jest.advanceTimersByTime(brand.page1.seconds * 1000)
    })
    expect(pushPageEvent).toHaveBeenCalledWith('Page1', 'page_exit')
    expect(goNextPage).toHaveBeenCalledTimes(1)
  })
})
