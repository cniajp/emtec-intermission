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
import { TalkMenuSkeleton } from '@/components/menu/TalkMenuSkeleton'
import {
  menuSnapshotKey,
  useMenuSnapshot,
} from '@/components/menu/useMenuSnapshot'

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

  const fresh = useGetTalksAndTracksForMenu(
    dkEventAbbr as Optional<string>,
    currentDay !== null ? String(currentDay) : null
  )
  // API から届くまでは、前回取得したデータがあれば先に出す
  const { view, allDays, isFromSnapshot } = useMenuSnapshot(
    currentDay !== null && dkEventAbbr
      ? menuSnapshotKey(dkEventAbbr, currentDay)
      : null,
    fresh
  )
  const isLoading = !router.isReady || fresh.isLoading

  const { prev, next } =
    currentDay !== null ? adjacentDays(allDays, currentDay) : {}
  // 表示時間などの上書き（クエリ）は日を切り替えても引き継ぐ
  const query = { ...router.query }
  delete query.confDay

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header>
        <DayNavigation
          // 日付はルーターの準備ができてから分かる
          label={
            `${(dkEventAbbr as string).toUpperCase()}` +
            (currentDay !== null ? ` Day ${currentDay}` : '')
          }
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
        {view && currentDay !== null ? (
          <>
            {isFromSnapshot && (
              <p className="mx-auto mb-3 flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-neutral-400">
                {isLoading
                  ? '前回取得したデータを表示しています（更新中…）'
                  : '最新のデータを取得できませんでした。前回取得したデータを表示しています。'}
                {!isLoading && <ReloadButton />}
              </p>
            )}
            <TalkMenu
              view={view}
              talkPathname={(id) => `/break-dk/talks/${id}`}
              renderAllTracksActions={(exportTracks) => (
                <>
                  <ObsModal
                    confDay={String(currentDay)}
                    allTracks={exportTracks}
                  />
                  <CompanionExportModal
                    companionPathname="/break-dk/companion"
                    eventAbbr={config.dkEventAbbr}
                    confDay={String(currentDay)}
                    allTracks={exportTracks}
                    talks={view.allTalks}
                  />
                </>
              )}
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
          </>
        ) : isLoading ? (
          <>
            <TalkMenuSkeleton />
            <div className="mx-auto mt-4 flex max-w-7xl items-center gap-3 text-[12px] text-neutral-500">
              読み込みに時間がかかる場合は
              <ReloadButton />
            </div>
          </>
        ) : (
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 py-16 text-[13px] text-neutral-400">
            タイムテーブルを取得できませんでした。
            <ReloadButton />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

type ObsModalProps = {
  confDay: string
  // track か allTracks のどちらか一方
  track?: Track
  allTracks?: Track[]
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

function ReloadButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.reload()}
      className="rounded-sm bg-neutral-700 px-3 py-1 text-[12px] text-white hover:bg-neutral-600 transition-colors"
    >
      更新
    </button>
  )
}

function ObsModal({ confDay, track, allTracks }: ObsModalProps) {
  // 取得に失敗してもメニューは落とさない（候補が出ないだけ）
  const tracksResult = useGetTracks({ throwOnError: false })
  const simulUrlSuggestions = (tracksResult.data || [])
    .filter((t) => t.videoId)
    .map((t) => ({ label: `Track ${t.name}`, url: t.videoId! }))
  return (
    <ObsExportModal
      obsPathname="/break-dk/obs"
      eventAbbr={config.dkEventAbbr}
      confDay={confDay}
      track={track}
      allTracks={allTracks}
      simulUrlSuggestions={simulUrlSuggestions}
    />
  )
}
