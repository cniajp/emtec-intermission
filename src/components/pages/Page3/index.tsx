import { Optional } from '@/utils/types'
import { TalkView } from '../../models/talkView'
import { useContext, useEffect, useMemo, useState, useRef } from 'react'
import { PageCtx } from '../../models/pageContext'
import config from '@/config'
import { staticConfig, buildPage3Images } from '@/staticConfig'
import PageHeader from '../PageHeader'
import Image from 'next/image'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'

type PageProps = { view: Optional<TalkView>; isDk: boolean }

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  const { alias, images, trackImages } = isDk
    ? staticConfig.breakDk.page3
    : staticConfig.break.page3
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
  const renderStartTime = useRef(performance.now())
  const hasMeasured = useRef(false)

  useEffect(() => {
    if (!hasMeasured.current) {
      const duration = performance.now() - renderStartTime.current
      pushPageMeasurement('Page3', duration)
      pushPageEvent('Page3', 'page_displayed')
      hasMeasured.current = true
    }

    if (isEmpty || count >= mergedImages.length) {
      pushPageEvent('Page3', 'page_exit')
      goNextPage()
    }
  }, [count, goNextPage, mergedImages.length, isEmpty])

  if (isEmpty) {
    return <PageHeader view={view} isDk={isDk} />
  }

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
      <Image
        src={`/${alias}/${mergedImages[count]}`}
        alt={'information'}
        width={1600}
        height={900}
        className="m-auto rounded-3xl shadow-lg my-[20px]"
      />
    </div>
  )
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
