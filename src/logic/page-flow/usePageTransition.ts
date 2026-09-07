import { useContext, useEffect } from 'react'
import { PageCtx } from './PageContext'

type PageName = 'Page1' | 'Page2' | 'Page3' | 'Page4'

// setTimeout でN秒後に goNextPage を呼ぶ共通ロジック。
export function useTimedPageTransition(pageName: PageName, seconds: number) {
  const { goNextPage } = useContext(PageCtx)
  useEffect(() => {
    const cancel = setTimeout(() => {
      goNextPage()
    }, seconds * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage, pageName, seconds])
}
