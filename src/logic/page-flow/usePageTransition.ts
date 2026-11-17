import { useContext, useEffect } from 'react'
import { PageCtx } from './PageContext'
import { PageRunningCtx } from './PageRunningContext'

type PageName = 'Page1' | 'Page2' | 'Page3' | 'Page4'

// 表示中のページが seconds 秒後に終わることを PageCtx に知らせる（BGM のフェードアウト用）。
// null なら終わりが決まっていないページ。アンマウントで取り消す。
// ローディング中（PageRunningCtx が false）は数え始めない
export function useAnnouncePageEnd(seconds: number | null) {
  const { setPageEndsAt } = useContext(PageCtx)
  const running = useContext(PageRunningCtx)
  useEffect(() => {
    if (seconds === null || !running) return
    setPageEndsAt(performance.now() + seconds * 1000)
    return () => setPageEndsAt(null)
  }, [seconds, setPageEndsAt, running])
}

// setTimeout でN秒後に goNextPage を呼ぶ共通ロジック。
// ローディング中（PageRunningCtx が false）は数え始めない
export function useTimedPageTransition(pageName: PageName, seconds: number) {
  const { goNextPage } = useContext(PageCtx)
  const running = useContext(PageRunningCtx)
  useAnnouncePageEnd(seconds)
  useEffect(() => {
    if (!running) return
    const cancel = setTimeout(() => {
      goNextPage()
    }, seconds * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage, pageName, seconds, running])
}
