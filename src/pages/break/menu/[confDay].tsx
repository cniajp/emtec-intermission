import { MenuView } from '@/components/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk } from '@/data/types'
import { getTimeStr } from '@/utils/time'
import { Optional } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { speakers } from '@/data/speakers'

export default function Index() {
  const router = useRouter()
  const { confDay } = router.query
  useEffect(() => {
    extendConfig(router.query as Record<string, string>)
  }, [router.query])
  const { eventAbbr } = config

  const view = MenuView.withoutDk(confDay as string, talks, tracks, speakers)

  return (
    <div>
      <div className="text-3xl text-white text-center w-full my-5">
        EMTEC Intermission - {(eventAbbr as string).toUpperCase()} Day{confDay}
      </div>
      <TalkMenu view={view} />
    </div>
  )
}

function TalkMenu({ view }: { view: Optional<MenuView> }) {
  if (!view) {
    return <></>
  }
  return (
    <div className="text-white w-full p-10">
      <div className="flex flex-row my-5 bg-gray-900 py-3">
        <div className="basis-1/12">
          <div className="text-lg">Slot</div>
        </div>
        <div className={'basis-11/12 grid grid-cols-4 gap-4'}>
          {view?.allTracks.map((track, i) => (
            <div key={i} className="text-lg">
              {track.name}
            </div>
          ))}
        </div>
      </div>
      {view.timeSlots().map((slot, i) => {
        return (
          <div className="flex flex-row my-5" key={i}>
            <div className="basis-1/12">
              {getTimeStr(slot.startTime)} - {getTimeStr(slot.endTime)}
            </div>
            <div className={'basis-11/12 grid grid-cols-4 gap-4'}>
              {view
                ?.getTalksOnTimeSlot(slot)
                .map((talk, i) => <TalkMenuItem key={i} talk={talk} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TalkMenuItem({ talk }: { talk: Optional<Talk> }) {
  const { query } = useRouter()
  delete query.confDay
  if (!talk) {
    return <div />
  }
  return (
    <Link
      className="col-span-1 hover:underline"
      href={{
        pathname: `/break/talks/${talk.id}`,
        query,
      }}
    >
      <div>{talk.id}</div>
      <div>{talk.title}</div>
      <div>{talk.speakers[0].name}</div>
    </Link>
  )
}
