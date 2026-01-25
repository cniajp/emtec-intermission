import '@/pages/globals-sub.css'
import { MenuView } from '@/components/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { getTimeStr } from '@/utils/time'
import { Optional } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { speakers } from '@/data/speakers'

type Props = {
  view: Optional<MenuView>
  confDay: string
}

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
      <TalkMenu view={view} confDay={confDay as string} />
    </div>
  )
}

function TalkMenu({ view, confDay }: Props) {
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
              {track.name} -
              <ObsModal confDay={confDay} track={track} />
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
              {view?.getTalksOnTimeSlot(slot).map((talk, i) => (
                <TalkMenuItem key={i} talk={talk} />
              ))}
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

type ObsModalProps = {
  confDay: string
  track: Track
}

function ObsModal({ confDay, track }: ObsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [os, setOs] = useState<'windows' | 'mac'>('windows')
  const [includeAttack, setIncludeAttack] = useState(false)
  const router = useRouter()

  const handleGenerate = () => {
    router.push({
      pathname: `/break/obs`,
      query: {
        confDay: confDay,
        trackId: track.id,
        trackName: track.name,
        includeAttack: includeAttack ? 'true' : 'false',
        os: os,
      },
    })
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="ml-2 text-sm text-blue-400 hover:underline"
      >
        OBS
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold mb-4">
              OBS Config - Track {track.name}
            </h3>

            <div className="mb-4">
              <label className="block text-sm mb-2">OS</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="os"
                    value="windows"
                    checked={os === 'windows'}
                    onChange={() => setOs('windows')}
                    className="mr-2"
                  />
                  Windows
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="os"
                    value="mac"
                    checked={os === 'mac'}
                    onChange={() => setOs('mac')}
                    className="mr-2"
                  />
                  Mac
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeAttack}
                  onChange={(e) => setIncludeAttack(e.target.checked)}
                  className="mr-2"
                />
                Include Attack Video Scenes
              </label>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
