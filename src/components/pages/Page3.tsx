import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useState, useRef } from 'react'
import { PageCtx } from '../models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'

type PageProps = { view: Optional<TalkView>; isDk: boolean }

const alias: string = 'janog57'

const images: string[] = [
  'info_001.jpg',
  'info_002.jpg',
  'info_003.jpg',
  'info_004.jpg',
  'info_005.jpg',
  'info_006.jpg',
  'info_007.jpg',
  'info_008.jpg',
  'info_009.jpg',
  'info_010.jpg',
  'info_011.jpg',
  'info_012.jpg',
  'info_013.jpg',
  'info_014.jpg',
  'info_015.jpg',
  'info_016.jpg',
  'info_017.jpg',
  'info_018.jpg',
  'info_019.jpg',
  'info_020.jpg',
  'info_021.jpg',
  'info_022.jpg',
  'info_023.jpg',
  'info_024.jpg',
  'info_025.jpg',
  'info_026.jpg',
  'info_027.jpg',
  'info_028.jpg',
  'info_029.jpg',
  'info_030.jpg',
  'info_031.jpg',
  'info_032.jpg',
  'info_033.jpg',
  'info_034.jpg',
  'info_035.jpg',
  'info_036.jpg',
  'info_037.jpg',
  'info_038.jpg',
  'info_039.jpg',
  'info_040.jpg',
  'info_041.jpg',
  'info_042.jpg',
]

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  const { count } = useCounter(images.length)
  const renderStartTime = useRef(performance.now())
  const hasMeasured = useRef(false)

  useEffect(() => {
    if (!hasMeasured.current) {
      const duration = performance.now() - renderStartTime.current
      pushPageMeasurement('Page3', duration)
      pushPageEvent('Page3', 'page_displayed')
      hasMeasured.current = true
    }

    if (count >= images.length) {
      pushPageEvent('Page3', 'page_exit')
      goNextPage()
    }
  }, [count, goNextPage])

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
      <Image
        src={`/${alias}/${images[count]}`}
        alt={'information'}
        width={1670}
        height={940}
        className="m-auto"
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
