import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect, useState } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'

type Props = { view: Optional<TalkView> }

const images = [
  '/cndt2023/info10.png',
  '/cndt2023/info1.png',
  '/cndt2023/info2.png',
  '/cndt2023/info3.png',
  '/cndt2023/info4.png',
  '/cndt2023/info5.png',
  '/cndt2023/info6.png',
  '/cndt2023/info7.png',
  '/cndt2023/info8.png',
  '/cndt2023/info9.png',
]

export default function Page({ view }: Props) {
  const { goNextPage } = useContext(PageCtx)
  const { count } = useCounter(images.length)
  useEffect(() => {
    if (count >= images.length) {
      goNextPage()
    }
  }, [count, goNextPage])

  return (
    <div>
      <PageHeader view={view} />
      <Image
        src={images[count]}
        alt={'information'}
        width={1920}
        height={1080}
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
