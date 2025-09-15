import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect, useState } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'

type Props = { view: Optional<TalkView> }

const images: string[] = [
  // '/cnds2025/info1.webp',
  // '/cnds2025/info2.webp',
  // '/cnds2025/info3.webp',
  // '/cnds2025/info4.webp',
  // '/cnds2025/info5.webp',
  // '/cnds2025/info6.webp',
  // '/cnds2025/info7.webp',
  // '/cnds2025/info8.webp',
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
