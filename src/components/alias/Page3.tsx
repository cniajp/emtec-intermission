import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useState } from 'react'
import { PageCtx } from '../models/pageContext'
import config from '@/config'
import PageHeader from './PageHeader'
import Image from 'next/image'

type Props = { view: Optional<TalkView>; eventAbbr: string }

export default function Page3({ view, eventAbbr }: Props) {
  const { goNextPage } = useContext(PageCtx)
  const exts = ['webp', 'png', 'jpeg', 'jpg']
  const [images, setImages] = useState<string[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const { count } = useCounter(images.length, imagesLoaded)

  useEffect(() => {
    const fetchImages = async () => {
      const foundImages: string[] = []
      for (let i = 1; i <= 8; i++) {
        for (const ext of exts) {
          const path = `/${config.eventAbbr}/info${i}.${ext}`
          try {
            const res = await fetch(path)
            if (res.ok) {
              foundImages.push(path)
              break
            }
          } catch (e) {
            // Ignore error, try next extension
          }
        }
      }
      setImages(foundImages)
      setImagesLoaded(true)
    }
    fetchImages()
  }, [eventAbbr])

  useEffect(() => {
    if (imagesLoaded) {
      if (images.length === 0) {
        // No images found, go to next page immediately
        goNextPage()
      } else if (count >= images.length) {
        goNextPage()
      }
    }
  }, [count, images.length, imagesLoaded, goNextPage])

  return (
    <div>
      <PageHeader view={view} eventAbbr={eventAbbr} />
      {imagesLoaded && images.length > 0 && images[count] ? (
        <Image
          src={images[count]}
          alt={'information'}
          width={1671}
          height={940}
          className="m-auto"
        />
      ) : imagesLoaded && images.length === 0 ? (
        <div className="text-white text-center text-2xl mt-20">
          No information images available
        </div>
      ) : (
        <div className="text-white text-center text-2xl mt-20">
          Loading information...
        </div>
      )}
    </div>
  )
}

const useCounter = (total: number, shouldStart: boolean) => {
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    if (!shouldStart || total === 0) return

    const timer = setInterval(
      () => {
        setCount((c) => c + 1)
      },
      (config.transTimePage3 * 1000) / total
    )
    return () => clearInterval(timer)
  }, [total, shouldStart])
  return { count }
}
