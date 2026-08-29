import { useContext, useEffect, useMemo, useState } from 'react'
import config from '@/config'
import { buildPage3Images } from '@/staticConfig'
import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import { PageCtx } from '@/logic/page-flow/PageContext'
import {
  emitPageExit,
  usePageDisplayTelemetry,
} from '@/logic/page-flow/usePageTelemetry'
import { useBrand } from '@/brand/BrandProvider'

export type Page3ViewModel = {
  isEmpty: boolean
  currentImageSrc: string | null
}

// Page3 は画像リストを一定間隔で切り替えつつ、全画像を出し終えたら次のページへ遷移する。
export function usePage3ViewModel(view: Optional<TalkView>): Page3ViewModel {
  const brand = useBrand()
  const { alias, images, trackImages } = brand.page3
  const trackId = view?.selectedTalk.trackId

  const mergedImages = useMemo(
    () =>
      buildPage3Images(
        images,
        trackId != null ? trackImages[trackId] : undefined
      ),
    [images, trackImages, trackId]
  )
  const isEmpty = mergedImages.length === 0

  const { count } = useCounter(isEmpty ? 1 : mergedImages.length)
  const { goNextPage } = useContext(PageCtx)

  usePageDisplayTelemetry('Page3')

  useEffect(() => {
    if (isEmpty || count >= mergedImages.length) {
      emitPageExit('Page3')
      goNextPage()
    }
  }, [count, goNextPage, mergedImages.length, isEmpty])

  return {
    isEmpty,
    currentImageSrc: isEmpty ? null : `/${alias}/${mergedImages[count]}`,
  }
}

const useCounter = (total: number) => {
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    const timer = setInterval(
      () => {
        setCount((c) => c + 1)
      },
      (config.transTimePage3 * 1000) / total
    )
    return () => clearInterval(timer)
  }, [total])
  return { count }
}
