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

// Page3 は画像リストを1枚あたり secondsPerImage 秒ずつ表示し、全画像を出し終えたら
// 次のページへ遷移する（合計時間 = 枚数 × secondsPerImage）。
// config.transTimePage3 が設定されていれば「1枚あたり秒数」の一時上書きとして優先する。
export function usePage3ViewModel(view: Optional<TalkView>): Page3ViewModel {
  const brand = useBrand()
  const { alias, images, trackImages, secondsPerImage } = brand.page3
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

  const { count } = useCounter(config.transTimePage3 ?? secondsPerImage)
  const { goNextPage } = useContext(PageCtx)

  usePageDisplayTelemetry('Page3')

  useEffect(() => {
    if (isEmpty || count >= mergedImages.length) {
      emitPageExit('Page3')
      goNextPage()
    }
  }, [count, goNextPage, mergedImages.length, isEmpty])

  // 最後の画像を出し終えた tick では count が length に達する。上の useEffect が
  // 次ページへ遷移させるが、それが走る前に一度レンダリングされるため、ここで
  // 素直に添字を引くと undefined になり `/{alias}/undefined` を取りに行って 404 になる。
  const current = mergedImages[count]

  return {
    isEmpty,
    currentImageSrc: current ? `/${alias}/${current}` : null,
  }
}

const useCounter = (secondsPerImage: number) => {
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c + 1)
    }, secondsPerImage * 1000)
    return () => clearInterval(timer)
  }, [secondsPerImage])
  return { count }
}
