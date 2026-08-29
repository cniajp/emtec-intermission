import { useContext, useEffect } from 'react'
import type { Playlist } from '@/components/media/playlist'
import { useBrand } from '@/brand/BrandProvider'
import { PageCtx } from '@/logic/page-flow/PageContext'
import {
  emitPageExit,
  usePageDisplayTelemetry,
} from '@/logic/page-flow/usePageTelemetry'

export type Page4ViewModel = {
  playlist: Playlist
  onEnded: () => void
}

// Page4 は動画プレイリストを表示。playlist が空なら即次ページへ。
export function usePage4ViewModel(): Page4ViewModel {
  const brand = useBrand()
  const { playlist } = brand.page4
  const { goNextPage } = useContext(PageCtx)

  usePageDisplayTelemetry('Page4')

  useEffect(() => {
    if (playlist.length === 0) {
      emitPageExit('Page4')
      goNextPage()
    }
    // 意図的に空依存: 表示時に一度だけ判定する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEnded = () => {
    emitPageExit('Page4')
    goNextPage()
  }

  return { playlist, onEnded }
}
