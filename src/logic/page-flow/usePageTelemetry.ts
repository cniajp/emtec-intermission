import { useEffect, useRef } from 'react'
import { pushPageEvent, pushPageMeasurement } from '@/lib/faro'

type PageName = 'Page1' | 'Page2' | 'Page3' | 'Page4'

export function usePageDisplayTelemetry(pageName: PageName) {
  const renderStartTime = useRef(performance.now())
  const hasMeasured = useRef(false)

  useEffect(() => {
    if (hasMeasured.current) return
    hasMeasured.current = true
    const duration = performance.now() - renderStartTime.current
    pushPageMeasurement(pageName, duration)
    pushPageEvent(pageName, 'page_displayed')
  }, [pageName])
}

export function emitPageExit(pageName: PageName) {
  pushPageEvent(pageName, 'page_exit')
}
