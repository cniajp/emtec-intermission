import { useContext, useEffect } from 'react'
import { PageCtx } from './PageContext'

type PageName = 'Page1' | 'Page2' | 'Page3' | 'Page4'

// 表示中のページが seconds 秒後に終わることを PageCtx に知らせる（BGM のフェードアウト用）。
// null なら終わりが決まっていないページ。アンマウントで取り消す
export function useAnnouncePageEnd(seconds: number | null) {
  const { setPageEndsAt } = useContext(PageCtx)
  useEffect(() => {
    if (seconds === null) return
    setPageEndsAt(performance.now() + seconds * 1000)
    return () => setPageEndsAt(null)
  }, [seconds, setPageEndsAt])
}

// setTimeout でN秒後に goNextPage を呼ぶ共通ロジック。
export function useTimedPageTransition(pageName: PageName, seconds: number) {
  const { goNextPage } = useContext(PageCtx)
  useAnnouncePageEnd(seconds)
  useEffect(() => {
    const cancel = setTimeout(() => {
      goNextPage()
    }, seconds * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage, pageName, seconds])
}
