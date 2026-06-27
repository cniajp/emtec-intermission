import { buildPage3Images, staticConfig } from '@/staticConfig'
import { Optional } from '@/utils/types'
import { TalkView } from '../../models/talkView'

type Props = { isDk: boolean; view: Optional<TalkView> }

export function Page3ImagePreLoader({ isDk, view }: Props) {
  const { alias, images, trackImages } = isDk
    ? staticConfig.breakDk.page3
    : staticConfig.break.page3
  const trackId = view?.selectedTalk.trackId
  const merged = buildPage3Images(
    images,
    trackId != null ? trackImages[trackId] : undefined
  )
  const first = merged[0]
  if (!first) return <></>
  return (
    <div className="hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/${alias}/${first}`} alt="for preload" />
    </div>
  )
}
