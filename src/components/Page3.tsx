import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect, useState } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'

type Props = { view: Optional<TalkView> }

const images = [
  '/cndw2024/info1.png',
  '/cndw2024/info2.png',
  '/cndw2024/info3.png',
  '/cndw2024/info4.png',
  '/cndw2024/info5.png',
  '/cndw2024/info6.png',
  '/cndw2024/info7.png',
  // せわしないので8以降はコメントアウト
  // '/cndw2024/info8.png',
  // '/cndw2024/info9.png',
  '/cndw2024/info10.png',
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
        width={1671}
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
