import { Optional } from '@/utils/types'
import { TalkView } from '@/logic/models/talkView'
import { useBrand } from '@/brand/BrandProvider'
import { getOverlappingTalks } from '@/logic/page-view-models/getOverlappingTalks'

type Props = { view: Optional<TalkView> }

export function AvatarPreLoader({ view }: Props) {
  const brand = useBrand()
  const defaultAvatar = brand.base.defaultAvatarSrc
  if (!view) {
    return <></>
  }
  const nextTalks = getOverlappingTalks(view)
  const talk = Object.values(nextTalks)[0]
  if (!talk) {
    return <></>
  }
  return (
    <div className="hidden">
      {view.allTracks.map((track, i) => {
        const talk = nextTalks[track.name]
        if (!talk) {
          return <></>
        }
        const speakers = view.speakersOf(talk.id)
        const avatarUrl = speakers[0]?.avatarUrl
        return avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            rel="preload"
            src={avatarUrl}
            alt="for preload"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar
            }}
          />
        ) : (
          <></>
        )
      })}
    </div>
  )
}
