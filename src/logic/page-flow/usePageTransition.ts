import { useContext, useEffect } from 'react'
import { PageCtx } from './PageContext'
import { emitPageExit } from './usePageTelemetry'

type PageName = 'Page1' | 'Page2' | 'Page3' | 'Page4'

// setTimeout でN秒後に goNextPage を呼ぶ共通ロジック。
// telemetry の page_exit も同時に発火する。
export function useTimedPageTransition(pageName: PageName, seconds: number) {
  const { goNextPage } = useContext(PageCtx)
  useEffect(() => {
    const cancel = setTimeout(() => {
      emitPageExit(pageName)
      goNextPage()
    }, seconds * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage, pageName, seconds])
}
