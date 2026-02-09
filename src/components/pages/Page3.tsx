import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useState } from 'react'
import { PageCtx } from '../models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'

type PageProps = { view: Optional<TalkView>; isDk: boolean }

const alias: string = 'janog57'

const images: string[] = [
  'image.png',
  // 'info_001.jpg',
  // 'info_002.jpg',
  // 'info_003.jpg',
  // 'info_004.jpg',
  // 'info_005.jpg',
]

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  const { count } = useCounter(images.length)
  useEffect(() => {
    if (count >= images.length) {
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
