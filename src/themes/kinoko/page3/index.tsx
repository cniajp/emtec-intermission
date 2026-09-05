import type { Page3PresenterProps } from '@/themes/types'
import PageHeader from '../PageHeader'
import Image from 'next/image'

export default function Page3Presenter({
  view,
  isEmpty,
  currentImageSrc,
}: Page3PresenterProps) {
  if (isEmpty || !currentImageSrc) {
    return <PageHeader view={view} />
  }
  return (
    <div>
      <PageHeader view={view} />
      <Image
        src={currentImageSrc}
        alt={'information'}
        width={1600}
        height={900}
        className="m-auto rounded-3xl shadow-lg my-[20px]"
        // Page3ImagePreLoader が生 URL で先読みするので、最適化を通すと
        // /_next/image?... の別エントリになり preload が効かない。生 URL で出す。
        unoptimized
      />
    </div>
  )
}
