import { useContext, useEffect, useState } from 'react'
import { PageCtx } from './PageContext'
import { PageRunningCtx } from './PageRunningContext'

type PageName = 'Page1' | 'Page2' | 'Page3' | 'Page4'

// 次のページへ切り替わる前に、表示中の要素が退場する時間（ms）。
// ページの表示時間に含める（合計時間は変わらない）。
// テーマ側の退場アニメーション（theme.module.css）はこの長さに収める
export const PAGE_EXIT_MS = 600

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
// ローディング中（PageRunningCtx が false）は数え始めない。
// 切り替わる PAGE_EXIT_MS 前から isLeaving が true になる（要素の退場アニメーション用）
export function useTimedPageTransition(
  pageName: PageName,
  seconds: number
): { isLeaving: boolean } {
  const { goNextPage } = useContext(PageCtx)
  const running = useContext(PageRunningCtx)
  const [isLeaving, setIsLeaving] = useState(false)
  useAnnouncePageEnd(seconds)
  useEffect(() => {
    if (!running) return
    const total = seconds * 1000
    // 表示時間が退場より短いページでは退場を省く
    const leave =
      total > PAGE_EXIT_MS
        ? setTimeout(() => setIsLeaving(true), total - PAGE_EXIT_MS)
        : undefined
    const cancel = setTimeout(() => {
      goNextPage()
    }, total)
    return () => {
      clearTimeout(leave)
      clearTimeout(cancel)
      setIsLeaving(false)
    }
  }, [goNextPage, pageName, seconds, running])
  return { isLeaving }
}
