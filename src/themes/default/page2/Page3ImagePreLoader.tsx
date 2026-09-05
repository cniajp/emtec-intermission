import { buildPage3Images } from '@/staticConfig'
import { Optional } from '@/utils/types'
import { TalkView } from '@/logic/models/talkView'
import { useBrand } from '@/brand/BrandProvider'

type Props = { view: Optional<TalkView> }

export function Page3ImagePreLoader({ view }: Props) {
  const brand = useBrand()
  const { alias, images, trackImages } = brand.page3
  const trackId = view?.selectedTalk.trackId
  const merged = buildPage3Images(
    images,
    trackId != null ? trackImages[trackId] : undefined
  )
  if (merged.length === 0) return <></>
  return (
    <div className="hidden">
      {merged.map((image) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={image} src={`/${alias}/${image}`} alt="for preload" />
      ))}
    </div>
  )
}
