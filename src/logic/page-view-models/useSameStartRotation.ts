import { useContext, useEffect, useMemo, useState } from 'react'
import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import { PageRunningCtx } from '@/logic/page-flow/PageRunningContext'

// 同じトラックに同じ開始時刻のトークが複数あるとき、ページの表示時間 seconds を
// 本数で等分して、表示するトークを順番に切り替えた view を返す。
// trackIds の中で最も本数が多いトラックに合わせて切り替える（Page2 は全トラック）
export function useSameStartRotation(
  view: Optional<TalkView>,
  seconds: number,
  trackIds: ReadonlyArray<number>
): Optional<TalkView> {
  const count = view
    ? Math.max(1, ...trackIds.map((id) => view.sameStartCountInTrack(id)))
    : 1
  const [rotation, setRotation] = useState(0)
  // ローディング中は切り替えを始めない（表示時間とずれるため）
  const running = useContext(PageRunningCtx)

  useEffect(() => {
    if (!running || count <= 1 || seconds <= 0) return
    const timer = setInterval(
      () => setRotation((r) => (r + 1) % count),
      (seconds * 1000) / count
    )
    return () => clearInterval(timer)
  }, [count, seconds, running])

  return useMemo(
    () => (view && count > 1 ? view.withRotation(rotation % count) : view),
    [view, count, rotation]
  )
}
