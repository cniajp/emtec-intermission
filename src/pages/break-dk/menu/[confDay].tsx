import '@/pages/globals-sub.css'
import { useGetTalksAndTracksForMenu } from '@/components/hooks/useGetTalksAndTracks'
import { MenuView } from '@/components/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { getTimeStr } from '@/utils/time'
import { Optional } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
  const { dkEventAbbr } = config

  const { isLoading, view } = useGetTalksAndTracksForMenu(
    dkEventAbbr as Optional<string>,
    confDay as Optional<string>
  )

  if (isLoading) {
    return <div className="text-white">Loading...</div>
  }
  return (
    <div>
      <div className="text-3xl text-white text-center w-full my-5">
        EMTEC Intermission - {(dkEventAbbr as string).toUpperCase()} Day
        {confDay}
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
        pathname: `/break-dk/talks/${talk.id}`,
        query,
      }}
    >
      <div>{talk.id}</div>
      <div>{talk.title}</div>
      <div>{talk.speakers[0]?.name}</div>
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
  const [username, setUsername] = useState('emtec')
  const router = useRouter()

  const handleGenerate = () => {
    router.push({
      pathname: `/break-dk/obs`,
      query: {
        confDay: confDay,
        trackId: track.id,
        trackName: track.name,
        includeAttack: includeAttack ? 'true' : 'false',
        os: os,
        username: username,
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl p-6 w-[560px] text-sm">
            <h3 className="text-base font-bold mb-4 text-center border-b border-gray-600 pb-3">
              OBS Scene Config - Track {track.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <label className="block text-xs font-medium mb-2">
                  Operating System
                </label>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center cursor-pointer hover:bg-gray-600/50 p-1.5 rounded text-xs">
                    <input
                      type="radio"
                      name={`os-${track.id}`}
                      value="windows"
                      checked={os === 'windows'}
                      onChange={() => setOs('windows')}
                      className="mr-2 w-3 h-3"
                    />
                    Windows
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-600/50 p-1.5 rounded text-xs">
                    <input
                      type="radio"
                      name={`os-${track.id}`}
                      value="mac"
                      checked={os === 'mac'}
                      onChange={() => setOs('mac')}
                      className="mr-2 w-3 h-3"
                    />
                    Mac
                  </label>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3">
                <label className="block text-xs font-medium mb-2">
                  Options
                </label>
                <label className="flex items-center cursor-pointer hover:bg-gray-600/50 p-1.5 rounded text-xs">
                  <input
                    type="checkbox"
                    checked={includeAttack}
                    onChange={(e) => setIncludeAttack(e.target.checked)}
                    className="mr-2 w-3 h-3"
                  />
                  Include Attack Videos
                </label>
              </div>
            </div>

            {includeAttack && (
              <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                <div className="mb-3 p-2 bg-blue-900/30 border border-blue-700/50 rounded text-[10px] text-blue-200">
                  <div className="font-medium mb-1">Video File Setup:</div>
                  <div className="text-blue-300/80">
                    Save attack videos to Desktop/{'{event}'}/{'{track}'}/
                    {'{HHMM}'}.mp4
                    <br />
                    Example: Desktop/srekaigi2026/A/0900.mp4
                  </div>
                </div>
                <label className="block text-xs font-medium mb-1">
                  Username (for video path)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-900 border border-gray-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="OS username"
                />
                <div className="mt-2 p-2 bg-gray-900 rounded text-[10px] text-gray-400 font-mono break-all">
                  {os === 'mac'
                    ? `/Users/${username}/Desktop/{event}/{track}/0900.mp4`
                    : `C:/Users/${username}/Desktop/{event}/{track}/0900.mp4`}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-3 border-t border-gray-600">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium"
              >
                Generate JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
