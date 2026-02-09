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
import { Header, Footer } from '@/components/Layout'

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

  // 全てのconferenceDayIdのユニーク値を取得
  const allDays = [
    ...new Set(
      talks
        .map((talk) => talk.conferenceDayId)
        .filter((id): id is number => id != null)
    ),
  ].sort((a, b) => a - b)

  const currentDay = Number(confDay)
  const prevDay = allDays.find(
    (d) =>
      d < currentDay && d === Math.max(...allDays.filter((x) => x < currentDay))
  )
  const nextDay = allDays.find(
    (d) =>
      d > currentDay && d === Math.min(...allDays.filter((x) => x > currentDay))
  )

  // 現在のDayの日付を取得
  const currentDayTalk = talks.find(
    (t) => t.conferenceDayId === currentDay && t.startTime
  )
  const currentDate = currentDayTalk?.startTime
    ? new Date(currentDayTalk.startTime)
    : null
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const dateStr = currentDate
    ? `${currentDate.getMonth() + 1}/${currentDate.getDate()}(${weekdays[currentDate.getDay()]})`
    : ''

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header>
        <DayNavigation
          prevDay={prevDay}
          nextDay={nextDay}
          currentDay={currentDay}
          eventAbbr={eventAbbr as string}
          dateStr={dateStr}
        />
      </Header>

      <main className="flex-1 p-8">
        <TalkMenu view={view} confDay={confDay as string} />
      </main>

      <Footer />
    </div>
  )
}

function TalkMenu({ view, confDay }: Props) {
  if (!view) {
    return <></>
  }
  return (
    <div className="mx-auto max-w-7xl text-white">
      <div className="mb-6 flex items-center rounded-lg border border-neutral-700 bg-neutral-800/50">
        <div className="w-28 shrink-0 border-r border-neutral-700 px-3 py-2">
          <span className="text-xs font-medium text-neutral-400">Time</span>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-px bg-neutral-700">
          {view?.allTracks.map((track, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-neutral-800 px-3 py-2"
            >
              <span className="text-sm font-medium">{track.name}</span>
              <div className="flex gap-1">
                <ObsModal confDay={confDay} track={track} />
                <CompanionModal confDay={confDay} track={track} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {view.timeSlots().map((slot, i) => (
          <div
            key={i}
            className="flex items-stretch rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden"
          >
            <div className="w-28 shrink-0 flex items-center justify-center border-r border-neutral-800 bg-neutral-800/30 px-3 py-3">
              <div className="text-center">
                <div className="text-xs font-medium text-white">
                  {getTimeStr(slot.startTime)}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {getTimeStr(slot.endTime)}
                </div>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-4 gap-px bg-neutral-800/30">
              {view?.getTalksOnTimeSlot(slot).map((talk, i) => (
                <TalkMenuItem key={i} talk={talk} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TalkMenuItem({ talk }: { talk: Optional<Talk> }) {
  const { query } = useRouter()
  delete query.confDay
  if (!talk) {
    return <div className="bg-neutral-900/50 p-4" />
  }
  return (
    <Link
      className="group block bg-neutral-900/50 p-3 transition-colors hover:bg-neutral-700/50"
      href={{
        pathname: `/break/talks/${talk.id}`,
        query,
      }}
    >
      <div className="mb-1 text-[10px] text-neutral-500">#{talk.id}</div>
      <div className="mb-1 text-xs font-medium leading-tight text-white group-hover:text-blue-300 transition-colors">
        {talk.title}
      </div>
      <div className="flex flex-wrap gap-x-1 text-[10px] text-neutral-400">
        {talk.speakers.map((s, i) => (
          <span key={i} className="whitespace-nowrap">
            {s.name}
            {i < talk.speakers.length - 1 && ','}
          </span>
        ))}
      </div>
    </Link>
  )
}

type ObsModalProps = {
  confDay: string
  track: Track
}

function CompanionModal({ confDay, track }: ObsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [device, setDevice] = useState<'gostream' | 'vr6hd'>('gostream')
  const [includeCount, setIncludeCount] = useState(true)
  const [includeTrackA, setIncludeTrackA] = useState(false)
  const [includeSlido, setIncludeSlido] = useState(false)
  const [includeAttack, setIncludeAttack] = useState(false)
  const router = useRouter()

  const handleGenerate = () => {
    router.push({
      pathname: `/break/companion`,
      query: {
        confDay: confDay,
        trackId: track.id,
        trackName: track.name,
        device: device,
        includeCount: includeCount ? 'true' : 'false',
        includeTrackA: includeTrackA ? 'true' : 'false',
        includeSlido: includeSlido ? 'true' : 'false',
        includeAttack: includeAttack ? 'true' : 'false',
      },
    })
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-green-600/20 px-2 py-1 text-xs text-green-400 hover:bg-green-600/30 transition-colors"
      >
        Companion
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl p-6 w-[560px] text-sm">
            <h3 className="text-sm font-bold mb-4 text-center border-b border-neutral-700 pb-3 text-white">
              Companion Config - Track {track.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3">
                <label className="block text-xs font-medium mb-2 text-neutral-300">
                  Device
                </label>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                    <input
                      type="radio"
                      name={`device-${track.id}`}
                      value="gostream"
                      checked={device === 'gostream'}
                      onChange={() => setDevice('gostream')}
                      className="mr-2 w-3 h-3"
                    />
                    GoStream
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                    <input
                      type="radio"
                      name={`device-${track.id}`}
                      value="vr6hd"
                      checked={device === 'vr6hd'}
                      onChange={() => setDevice('vr6hd')}
                      className="mr-2 w-3 h-3"
                    />
                    VR-6HD
                  </label>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3">
                <label className="block text-xs font-medium mb-2 text-neutral-300">
                  Special Buttons
                </label>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                    <input
                      type="checkbox"
                      checked={includeCount}
                      onChange={(e) => setIncludeCount(e.target.checked)}
                      className="mr-2 w-3 h-3"
                    />
                    Countdown
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                    <input
                      type="checkbox"
                      checked={includeTrackA}
                      onChange={(e) => setIncludeTrackA(e.target.checked)}
                      className="mr-2 w-3 h-3"
                    />
                    TrackA
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                    <input
                      type="checkbox"
                      checked={includeSlido}
                      onChange={(e) => setIncludeSlido(e.target.checked)}
                      className="mr-2 w-3 h-3"
                    />
                    Slido
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                    <input
                      type="checkbox"
                      checked={includeAttack}
                      onChange={(e) => setIncludeAttack(e.target.checked)}
                      className="mr-2 w-3 h-3"
                    />
                    Attack Videos
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-neutral-700">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded transition-colors text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-1.5 text-xs bg-green-600 hover:bg-green-500 rounded transition-colors font-medium text-white"
              >
                Generate Config
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

type DayNavigationProps = {
  prevDay: number | undefined
  nextDay: number | undefined
  currentDay: number
  eventAbbr: string
  dateStr: string
}

function DayNavigation({
  prevDay,
  nextDay,
  currentDay,
  eventAbbr,
  dateStr,
}: DayNavigationProps) {
  const { query } = useRouter()
  const newQuery = { ...query }
  delete newQuery.confDay

  return (
    <div className="flex items-center gap-4">
      {prevDay !== undefined ? (
        <Link
          href={{ pathname: `/break/menu/${prevDay}`, query: newQuery }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          ←
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-600">
          ←
        </span>
      )}
      <div className="text-center">
        <div className="text-lg font-bold text-white">
          {eventAbbr.toUpperCase()} Day {currentDay}
        </div>
        {dateStr && <div className="text-sm text-neutral-400">{dateStr}</div>}
      </div>
      {nextDay !== undefined ? (
        <Link
          href={{ pathname: `/break/menu/${nextDay}`, query: newQuery }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          →
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-600">
          →
        </span>
      )}
    </div>
  )
}

function ObsModal({ confDay, track }: ObsModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [os, setOs] = useState<'windows' | 'mac'>('windows')
  const [includeAttack, setIncludeAttack] = useState(false)
  const [username, setUsername] = useState('emtec')
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
        username: username,
      },
    })
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-600/20 px-2 py-1 text-xs text-blue-400 hover:bg-blue-600/30 transition-colors"
      >
        OBS
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl p-6 w-[560px] text-sm">
            <h3 className="text-sm font-bold mb-4 text-center border-b border-neutral-700 pb-3 text-white">
              OBS Scene Config - Track {track.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3">
                <label className="block text-xs font-medium mb-2 text-neutral-300">
                  Operating System
                </label>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
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
                  <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
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

              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3">
                <label className="block text-xs font-medium mb-2 text-neutral-300">
                  Options
                </label>
                <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
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
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3 mb-4">
                <label className="block text-xs font-medium mb-1 text-neutral-300">
                  Username (for video path)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="OS username"
                />
                <div className="mt-2 p-2 bg-neutral-900 rounded text-[10px] text-neutral-400 font-mono break-all">
                  {os === 'mac'
                    ? `/Users/${username}/Desktop/{event}/{track}/0900.mp4`
                    : `C:/Users/${username}/Desktop/{event}/{track}/0900.mp4`}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-3 border-t border-neutral-700">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded transition-colors text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium text-white"
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
