import '@/pages/globals-sub.css'
import {
  useGetTalksAndTracksForMenu,
  useGetTracks,
} from '@/components/hooks/useGetTalksAndTracks'
import { MenuView } from '@/components/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { getTimeStr } from '@/utils/time'
import { Optional } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Header, Footer } from '@/components/Layout'
import {
  buildCompanionConfig,
  downloadCompanionConfig,
  type CompanionConfig,
} from '@/components/tools/CompanionConfigGenerate'
import CompanionPreview from '@/components/tools/CompanionPreview'
import { useBodyScrollLock } from '@/components/hooks/useBodyScrollLock'

type Props = {
  view: Optional<MenuView>
  confDay: string
}

export default function Index() {
  const router = useRouter()
  useEffect(() => {
    extendConfig(router.query as Record<string, string>)
  }, [router.query])
  const { dkEventAbbr } = config

  // router.queryではなくasPathから日付を取得（ナビゲーション時の更新問題を回避）
  const currentDay = useMemo(() => {
    if (!router.isReady) return null
    const match = router.asPath.match(/\/break-dk\/menu\/(\d+)/)
    return match ? Number(match[1]) : null
  }, [router.asPath, router.isReady])

  const { view, allDays, isEventLoading } = useGetTalksAndTracksForMenu(
    dkEventAbbr as Optional<string>,
    currentDay !== null ? String(currentDay) : null
  )

  // ルーターの準備完了まで、またはイベント情報が取得されるまでローディング
  // allDaysにデータがある場合はキャッシュがあるのでローディングを表示しない
  if (
    !router.isReady ||
    currentDay === null ||
    (isEventLoading && allDays.length === 0)
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-900">
        <div className="text-white">Loading...</div>
        <button
          onClick={() => router.reload()}
          className="rounded bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-600 transition-colors"
        >
          更新
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header>
        <DayNavigation
          currentDay={currentDay}
          eventAbbr={dkEventAbbr as string}
          allDays={allDays}
        />
      </Header>

      <main className="flex-1 p-8">
        <TalkMenu view={view} confDay={String(currentDay)} />
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
                <CompanionModal
                  confDay={confDay}
                  track={track}
                  talks={view.allTalks}
                />
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
        pathname: `/break-dk/talks/${talk.id}`,
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

type CompanionModalProps = {
  confDay: string
  track: Track
  talks: Talk[]
}

function CompanionModal({ track, talks }: CompanionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  useBodyScrollLock(isOpen)
  const [step, setStep] = useState<'form' | 'preview'>('form')
  const [companionConfig, setCompanionConfig] =
    useState<CompanionConfig | null>(null)
  const [device, setDevice] = useState<'gostream' | 'vr6hd'>('gostream')
  const [includeCount, setIncludeCount] = useState(true)
  const [includeTrackA, setIncludeTrackA] = useState(false)
  const [includeSlido, setIncludeSlido] = useState(false)
  const [includeAttack, setIncludeAttack] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
    setStep('form')
    setCompanionConfig(null)
  }

  const handleBuildPreview = () => {
    const trackTalks = talks
      .filter((talk) => talk.trackId === track.id)
      .sort((a, b) => {
        if (a.startTime < b.startTime) return -1
        if (a.startTime > b.startTime) return 1
        return 0
      })

    const times: string[] = trackTalks.map((talk) => {
      const startTime = new Date(talk.startTime)
      const hours = startTime.getHours().toString().padStart(2, '0')
      const minutes = startTime.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    })

    const built = buildCompanionConfig({
      device,
      times,
      specialButtons: {
        count: includeCount,
        trackA: includeTrackA,
        slido: includeSlido,
      },
      includeAttack,
    })
    setCompanionConfig(built)
    setStep('preview')
  }

  const handleExport = () => {
    if (!companionConfig) return
    downloadCompanionConfig(companionConfig)
    closeModal()
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
          <div
            className={`bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl p-6 text-sm max-w-[95vw] max-h-[90vh] overflow-y-auto ${
              step === 'preview' ? 'w-[1100px]' : 'w-[560px]'
            }`}
          >
            <h3 className="text-sm font-bold mb-4 text-center border-b border-neutral-700 pb-3 text-white">
              Companion Config - Track {track.name}
              {step === 'preview' && ` (${device})`}
            </h3>

            {step === 'form' && (
              <>
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
                    onClick={closeModal}
                    className="px-4 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded transition-colors text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBuildPreview}
                    className="px-4 py-1.5 text-xs bg-green-600 hover:bg-green-500 rounded transition-colors font-medium text-white"
                  >
                    Preview
                  </button>
                </div>
              </>
            )}

            {step === 'preview' && companionConfig && (
              <>
                <div className="mb-4">
                  <CompanionPreview config={companionConfig} />
                </div>
                <div className="flex gap-3 justify-between pt-3 border-t border-neutral-700">
                  <button
                    onClick={() => setStep('form')}
                    className="px-4 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded transition-colors text-white"
                  >
                    ← Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-1.5 text-xs bg-neutral-700 hover:bg-neutral-600 rounded transition-colors text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExport}
                      className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium text-white"
                    >
                      Export
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

type DayNavigationProps = {
  currentDay: number
  eventAbbr: string
  allDays: number[]
}

function DayNavigation({ currentDay, eventAbbr, allDays }: DayNavigationProps) {
  const router = useRouter()
  const { query } = router
  const newQuery = { ...query }
  delete newQuery.confDay

  const prevDay = allDays.find(
    (d) =>
      d < currentDay && d === Math.max(...allDays.filter((x) => x < currentDay))
  )
  const nextDay = allDays.find(
    (d) =>
      d > currentDay && d === Math.min(...allDays.filter((x) => x > currentDay))
  )

  const navigateToDay = (day: number) => {
    router.push(
      { pathname: `/break-dk/menu/${day}`, query: newQuery },
      undefined,
      { shallow: false }
    )
  }

  return (
    <div className="flex items-center gap-4">
      {prevDay !== undefined ? (
        <button
          onClick={() => navigateToDay(prevDay)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          ←
        </button>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-600">
          ←
        </span>
      )}
      <div className="text-center">
        <div className="text-lg font-bold text-white">
          {eventAbbr.toUpperCase()} Day {currentDay}
        </div>
      </div>
      {nextDay !== undefined ? (
        <button
          onClick={() => navigateToDay(nextDay)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          →
        </button>
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
  useBodyScrollLock(isOpen)
  const [os, setOs] = useState<'windows' | 'mac'>('windows')
  const [includeAttack, setIncludeAttack] = useState(false)
  const [includeBackground, setIncludeBackground] = useState(false)
  const [includeCountdown, setIncludeCountdown] = useState(false)
  const [includeSimul, setIncludeSimul] = useState(false)
  const [simulUrl, setSimulUrl] = useState(
    'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  )
  const [username, setUsername] = useState('emtec')
  const router = useRouter()
  const tracksResult = useGetTracks()
  const trackUrlSuggestions = (tracksResult.data || []).filter((t) => t.videoId)

  const handleGenerate = () => {
    router.push({
      pathname: `/break-dk/obs`,
      query: {
        confDay: confDay,
        trackId: track.id,
        trackName: track.name,
        includeAttack: includeAttack ? 'true' : 'false',
        includeBackground: includeBackground ? 'true' : 'false',
        includeCountdown: includeCountdown ? 'true' : 'false',
        includeSimul: includeSimul ? 'true' : 'false',
        simulUrl: simulUrl,
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
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl p-6 w-[900px] text-sm">
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
                  アタック動画
                </label>
                <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                  <input
                    type="checkbox"
                    checked={includeCountdown}
                    onChange={(e) => setIncludeCountdown(e.target.checked)}
                    className="mr-2 w-3 h-3"
                  />
                  カウントダウン
                </label>
                <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                  <input
                    type="checkbox"
                    checked={includeSimul}
                    onChange={(e) => setIncludeSimul(e.target.checked)}
                    className="mr-2 w-3 h-3"
                  />
                  サイマル
                </label>
                <label className="flex items-center cursor-pointer hover:bg-neutral-700/50 p-1.5 rounded text-xs text-white">
                  <input
                    type="checkbox"
                    checked={includeBackground}
                    onChange={(e) => setIncludeBackground(e.target.checked)}
                    className="mr-2 w-3 h-3"
                  />
                  すべてシーンに背景画像を敷く
                </label>
              </div>
            </div>

            {includeSimul && (
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-medium text-neutral-300">
                    サイマル URL (VLC playlist)
                  </label>
                  <a
                    href="https://players.akamai.com/players/hlsjs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-[10px] transition-colors"
                  >
                    HLSテストプレイヤー ↗
                  </a>
                </div>
                <input
                  type="text"
                  value={simulUrl}
                  onChange={(e) => setSimulUrl(e.target.value)}
                  list={`simul-urls-${track.id}`}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
                <datalist id={`simul-urls-${track.id}`}>
                  {trackUrlSuggestions.map((t) => (
                    <option key={t.id} value={t.videoId!}>
                      Track {t.name}
                    </option>
                  ))}
                </datalist>
                {simulUrl && (
                  <div className="mt-2 p-2 bg-neutral-900 rounded text-[10px] text-neutral-400 font-mono flex items-start gap-2">
                    <div className="break-all flex-1">{simulUrl}</div>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(simulUrl)
                        } catch (err) {
                          console.error('Copy failed:', err)
                        }
                      }}
                      className="shrink-0 px-2 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-[10px] transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            )}

            {(includeAttack || includeBackground || includeCountdown) && (
              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-3 mb-4">
                <label className="block text-xs font-medium mb-1 text-neutral-300">
                  Username (for file path)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="OS username"
                />
                {includeAttack && (
                  <div className="mt-2 p-2 bg-neutral-900 rounded text-[10px] text-neutral-400 font-mono break-all">
                    {os === 'mac'
                      ? `/Users/${username}/Desktop/{event}/{track}/0900.mp4`
                      : `C:/Users/${username}/Desktop/{event}/{track}/0900.mp4`}
                  </div>
                )}
                {includeCountdown && (
                  <div className="mt-2 p-2 bg-neutral-900 rounded text-[10px] text-neutral-400 font-mono break-all">
                    {os === 'mac'
                      ? `/Users/${username}/Desktop/{event}/countdown.mp4`
                      : `C:/Users/${username}/Desktop/{event}/countdown.mp4`}
                  </div>
                )}
                {includeBackground && (
                  <div className="mt-2 p-2 bg-neutral-900 rounded text-[10px] text-neutral-400 font-mono break-all">
                    {os === 'mac'
                      ? `/Users/${username}/Desktop/{event}/still/LogoOnly_wBG.png`
                      : `C:/Users/${username}/Desktop/{event}/still/LogoOnly_wBG.png`}
                  </div>
                )}
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
