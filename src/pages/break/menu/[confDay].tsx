import '@/pages/globals-sub.css'
import { MenuView } from '@/logic/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { speakers } from '@/data/speakers'
import { Header, Footer } from '@/components/Layout'
import ObsExportModal from '@/components/tools/ObsExportModal'
import CompanionExportModal from '@/components/tools/CompanionExportModal'
import { TalkMenu } from '@/components/menu/TalkMenu'
import { DayNavigation, adjacentDays } from '@/components/menu/DayNavigation'

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
  const { prev, next } = adjacentDays(allDays, currentDay)
  // 表示時間などの上書き（クエリ）は日を切り替えても引き継ぐ
  const query = { ...router.query }
  delete query.confDay

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
          label={`${(eventAbbr as string).toUpperCase()} Day ${currentDay}`}
          dateStr={dateStr}
          prevHref={
            prev !== undefined
              ? { pathname: `/break/menu/${prev}`, query }
              : undefined
          }
          nextHref={
            next !== undefined
              ? { pathname: `/break/menu/${next}`, query }
              : undefined
          }
        />
      </Header>

      <main className="flex-1 px-4 py-6 sm:p-8">
        {view && (
          <TalkMenu
            view={view}
            talkPathname={(id) => `/break/talks/${id}`}
            renderTrackActions={(track) => (
              <>
                <ObsModal confDay={confDay as string} track={track} />
                <CompanionModal
                  confDay={confDay as string}
                  track={track}
                  talks={view.allTalks}
                />
              </>
            )}
          />
        )}
      </main>

      <Footer />
    </div>
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
