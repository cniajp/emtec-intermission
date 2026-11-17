import type { Page3PresenterProps } from '@/themes/types'
import PageHeader from '../PageHeader'
import Image from 'next/image'
import { motion } from '../motion'

export default function Page3Presenter({
  view,
  isEmpty,
  currentImageSrc,
}: Page3PresenterProps) {
  if (isEmpty || !currentImageSrc) {
    return <PageHeader view={view} />
  }
  // 画像は 1 枚ごとに下から入る（key を変えて、切り替えのたびに動かす）
  const m = motion('up', false)
  return (
    <div>
      <PageHeader view={view} />
      <Image
        key={currentImageSrc}
        src={currentImageSrc}
        alt={'information'}
        width={1600}
        height={900}
        className={`m-auto rounded-3xl shadow-lg my-[20px] ${m.className}`}
        style={m.style}
        // Page3ImagePreLoader が生 URL で先読みするので、最適化を通すと
        // /_next/image?... の別エントリになり preload が効かない。生 URL で出す。
        unoptimized
      />
    </div>
  )
}
