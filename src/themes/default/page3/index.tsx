import { useState } from 'react'
import type { Page3PresenterProps } from '@/themes/types'
import PageHeader from '../PageHeader'
import Image from 'next/image'
import { motion } from '../motion'
import styles from '../theme.module.css'

export default function Page3Presenter({
  view,
  isEmpty,
  currentImageSrc,
}: Page3PresenterProps) {
  // 画像が替わったら、直前の画像を押し出し用に残す
  const [shown, setShown] = useState<{
    current: string | null
    prev: string | null
  }>({ current: currentImageSrc, prev: null })
  if (currentImageSrc && shown.current !== currentImageSrc) {
    setShown({ current: currentImageSrc, prev: shown.current })
  }

  if (isEmpty || !currentImageSrc) {
    return <PageHeader view={view} />
  }
  const prev = shown.current === currentImageSrc ? shown.prev : shown.current
  // 枠は Page3 に入るときに下から入る。画像の切り替えでは枠は動かさない
  const frame = motion('up', false)
  return (
    <div>
      <PageHeader view={view} />
      {/* 枠は固定し、中の画像だけを左へ押し出して次の画像を右から入れる
          （Page1 の同時刻セッションの切り替えと同じ動き） */}
      <div
        className={`relative m-auto my-[20px] w-[1600px] h-[900px] overflow-hidden rounded-3xl shadow-lg ${frame.className}`}
        style={frame.style}
      >
        {prev && <Slide key={prev} src={prev} className={styles.talkPushOut} />}
        <Slide
          key={currentImageSrc}
          src={currentImageSrc}
          className={prev ? styles.talkPushIn : ''}
        />
      </div>
    </div>
  )
}

function Slide({ src, className }: { src: string; className: string }) {
  return (
    <Image
      src={src}
      alt={'information'}
      width={1600}
      height={900}
      className={`absolute inset-0 ${className}`}
      // Page3ImagePreLoader が生 URL で先読みするので、最適化を通すと
      // /_next/image?... の別エントリになり preload が効かない。生 URL で出す。
      unoptimized
    />
  )
}
