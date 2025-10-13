import { Optional } from '@/utils/types'
import { TalkView } from './models/talkView'
import { useContext, useEffect, useState } from 'react'
import { PageCtx } from './models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'

type PageProps = { view: Optional<TalkView>; isDk: boolean }
type Props = { view: Optional<TalkView> }

const images: string[] = [
  '/pek2025/info001.png',
  '/pek2025/info002.png',
  '/pek2025/info003.png',
  '/pek2025/info004.png',
  '/pek2025/info005.png',
  '/pek2025/info006.png',
  '/pek2025/info007.png',
  // '/pek2025/info008.png',
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
        src={images[count]}
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
