import { Optional } from '@/utils/types'
import { TalkView } from '../../models/talkView'
import { staticConfig } from '@/staticConfig'
import { getOverlappingTalks } from './getOverlappingTalks'

type Props = { view: Optional<TalkView>; isDk: boolean }

const defaultAvatarOf = (isDk: boolean) =>
  isDk
    ? staticConfig.breakDk.base.defaultAvatarSrc
    : staticConfig.break.base.defaultAvatarSrc

export function AvatarPreLoader({ view, isDk }: Props) {
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
              e.currentTarget.src = defaultAvatarOf(isDk)
            }}
          />
        ) : (
          <></>
        )
      })}
    </div>
  )
}
