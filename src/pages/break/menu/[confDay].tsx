import '@/pages/globals-sub.css'
import { MenuView } from '@/logic/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { getTimeStr } from '@/utils/time'
import { Optional } from '@/utils/types'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { speakers } from '@/data/speakers'
import { Header, Footer } from '@/components/Layout'
import ObsExportModal from '@/components/tools/ObsExportModal'
import CompanionExportModal from '@/components/tools/CompanionExportModal'

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

type CompanionModalProps = {
  confDay: string
  track: Track
  talks: Talk[]
}

function CompanionModal({ confDay, track, talks }: CompanionModalProps) {
  return (
    <CompanionExportModal
      companionPathname="/break/companion"
      eventAbbr={config.eventAbbr}
      confDay={confDay}
      track={track}
      talks={talks}
    />
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
  return (
    <ObsExportModal
      obsPathname="/break/obs"
      eventAbbr={config.eventAbbr}
      confDay={confDay}
      track={track}
    />
  )
}
