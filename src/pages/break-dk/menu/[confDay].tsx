import '@/pages/globals-sub.css'
import {
  useGetTalksAndTracksForMenu,
  useGetTracks,
} from '@/logic/data/dreamkast/useGetTalksAndTracks'
import { MenuView } from '@/logic/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { getTimeStr } from '@/utils/time'
import { Optional } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { Header, Footer } from '@/components/Layout'
import ObsExportModal from '@/components/tools/ObsExportModal'
import CompanionExportModal from '@/components/tools/CompanionExportModal'

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
          className="rounded-sm bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-600 transition-colors"
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

function CompanionModal({ confDay, track, talks }: CompanionModalProps) {
  return (
    <CompanionExportModal
      companionPathname="/break-dk/companion"
      eventAbbr={config.dkEventAbbr}
      confDay={confDay}
      track={track}
      talks={talks}
    />
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
  const tracksResult = useGetTracks()
  const simulUrlSuggestions = (tracksResult.data || [])
    .filter((t) => t.videoId)
    .map((t) => ({ label: `Track ${t.name}`, url: t.videoId! }))
  return (
    <ObsExportModal
      obsPathname="/break-dk/obs"
      eventAbbr={config.dkEventAbbr}
      confDay={confDay}
      track={track}
      simulUrlSuggestions={simulUrlSuggestions}
    />
  )
}
