import '@/pages/globals-sub.css'
import {
  useGetTalksAndTracksForMenu,
  useGetTracks,
} from '@/logic/data/dreamkast/useGetTalksAndTracks'
import config, { extendConfig } from '@/config'
import type { Talk, Track } from '@/data/types'
import { Optional } from '@/utils/types'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { Header, Footer } from '@/components/Layout'
import ObsExportModal from '@/components/tools/ObsExportModal'
import CompanionExportModal from '@/components/tools/CompanionExportModal'
import { TalkMenu } from '@/components/menu/TalkMenu'
import { DayNavigation, adjacentDays } from '@/components/menu/DayNavigation'

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
        <div className="text-[14px] text-white">Loading...</div>
        <button
          onClick={() => router.reload()}
          className="rounded-sm bg-neutral-700 px-4 py-2 text-[13px] text-white hover:bg-neutral-600 transition-colors"
        >
          更新
        </button>
      </div>
    )
  }

  const { prev, next } = adjacentDays(allDays, currentDay)
  // 表示時間などの上書き（クエリ）は日を切り替えても引き継ぐ
  const query = { ...router.query }
  delete query.confDay

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header>
        <DayNavigation
          label={`${(dkEventAbbr as string).toUpperCase()} Day ${currentDay}`}
          prevHref={
            prev !== undefined
              ? { pathname: `/break-dk/menu/${prev}`, query }
              : undefined
          }
          nextHref={
            next !== undefined
              ? { pathname: `/break-dk/menu/${next}`, query }
              : undefined
          }
        />
      </Header>

      <main className="flex-1 px-4 py-6 sm:p-8">
        {view && (
          <TalkMenu
            view={view}
            talkPathname={(id) => `/break-dk/talks/${id}`}
            renderTrackActions={(track) => (
              <>
                <ObsModal confDay={String(currentDay)} track={track} />
                <CompanionModal
                  confDay={String(currentDay)}
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
      companionPathname="/break-dk/companion"
      eventAbbr={config.dkEventAbbr}
      confDay={confDay}
      track={track}
      talks={talks}
    />
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
