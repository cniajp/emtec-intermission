import { renderHook } from '@testing-library/react'
import { usePageDisplayTelemetry } from '@/logic/page-flow/usePageTelemetry'
import { pushPageEvent, pushPageMeasurement } from '@/lib/faro'

jest.mock('@/lib/faro')

describe('usePageDisplayTelemetry', () => {
  it('マウント時に pushPageMeasurement と pushPageEvent("page_displayed") を1度ずつ呼ぶ', () => {
    renderHook(() => usePageDisplayTelemetry('Page1'))

    expect(pushPageMeasurement).toHaveBeenCalledTimes(1)
    expect(pushPageMeasurement).toHaveBeenCalledWith(
      'Page1',
      expect.any(Number)
    )
    expect(pushPageEvent).toHaveBeenCalledTimes(1)
    expect(pushPageEvent).toHaveBeenCalledWith('Page1', 'page_displayed')
  })

  it('再レンダーで重複発火しない (hasMeasured ガード)', () => {
    const { rerender } = renderHook(() => usePageDisplayTelemetry('Page2'))
    rerender()
    rerender()
    expect(pushPageMeasurement).toHaveBeenCalledTimes(1)
    expect(pushPageEvent).toHaveBeenCalledTimes(1)
  })
})
