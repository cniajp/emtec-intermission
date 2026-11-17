import '@/pages/globals-sub.css'
import { MenuView } from '@/logic/models/talkView'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { useRouter } from 'next/router'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { getTime } from '@/utils/time'
import { useEffect } from 'react'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { speakers } from '@/data/speakers'
import { Header, Footer } from '@/components/Layout'
import ObsExportModal from '@/components/tools/ObsExportModal'
import CompanionExportModal from '@/components/tools/CompanionExportModal'
import { TalkMenu } from '@/components/menu/TalkMenu'
import {
  DayNavigation,
  adjacentDays,
  menuDays,
} from '@/components/menu/DayNavigation'

// 日ごとのメニューをビルド時に HTML へ書き出す。データは src/data にあって API を
// 呼ばないので、JS の読み込みを待たずにタイムテーブルを表示できる
export const getStaticPaths: GetStaticPaths = () => ({
  paths: menuDays(talks).map((day) => ({ params: { confDay: String(day) } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export default function Index() {
  const router = useRouter()
  const { confDay } = router.query
  useEffect(() => {
    extendConfig(router.query as Record<string, string>)
  }, [router.query])
  const { eventAbbr } = config

  const view = MenuView.withoutDk(confDay as string, talks, tracks, speakers)

  const allDays = menuDays(talks)

  const currentDay = Number(confDay)
  const { prev, next } = adjacentDays(allDays, currentDay)
  // 表示時間などの上書き（クエリ）は日を切り替えても引き継ぐ
  const query = { ...router.query }
  delete query.confDay

  // 現在のDayの日付を取得
  const currentDayTalk = talks.find(
    (t) => t.conferenceDayId === currentDay && t.startTime
  )
  // 日付は会場の時刻（Asia/Tokyo）で出す。new Date() の getDate() などは実行環境の
  // タイムゾーンに依存し、ビルド時（UTC）とブラウザで結果が変わることがある
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const currentDate = currentDayTalk?.startTime
    ? getTime(currentDayTalk.startTime)
    : null
  const dateStr = currentDate
    ? `${currentDate.format('M/D')}(${weekdays[currentDate.day()]})`
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
