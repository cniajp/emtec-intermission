import config from '@/config'
import { useBrand } from '@/brand/BrandProvider'
import type { Optional } from '@/utils/types'
import type { Speaker, Talk, Track } from '@/data/types'
import type { TalkView } from '@/logic/models/talkView'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'
import { getOverlappingTalks } from './getOverlappingTalks'
import { useSameStartRotation } from './useSameStartRotation'

// 業務ルール: オープニング/hacomono体操の時間帯は並行セッションがないため他トラックを非表示にする。
// TODO: kinoko2026 の一時対応。他イベントには影響しない値なので commonize せずここに閉じ込める。
const HIDE_OTHER_TRACKS_TALK_IDS: ReadonlyArray<number> = [9001, 9002]

export type Page2TrackRow = {
  talk: Talk
  track: Track
  speakers: Speaker[]
  trackIndex: number
  // 同時刻セッションを順番に切り替えるときのセッションごとの色（Page1 のカードと同じ色）。
  // 切り替えが無いトラックは null
  rotationColor: string | null
}

export type Page2ViewModel = {
  // 同時刻セッションの切り替えを反映した view（Presenter にはこちらを渡す）
  view: Optional<TalkView>
  timeRange: { start: string; end: string } | null
  rows: Page2TrackRow[]
  // 1トラックのイベントで、同時刻セッションを切り替えずに全部並べているか
  showsAllSameStart: boolean
}

const EMPTY = { timeRange: null, rows: [], showsAllSameStart: false }

// Page2 に同時に並べられるカードの上限（2列×2段）
const MAX_ROWS_AT_ONCE = 4

export function usePage2ViewModel(
  originalView: Optional<TalkView>
): Page2ViewModel {
  const brand = useBrand()
  const seconds = config.transTimePage2 ?? brand.page2.seconds
  useTimedPageTransition('Page2', seconds)
  // 1トラックだけのイベントは Page2 の枠が空くので、同時刻セッションを切り替えずに全部並べる
  const onlyTrack =
    originalView?.allTracks.length === 1 ? originalView.allTracks[0] : null
  const sameStartTalks = onlyTrack
    ? originalView!.sameStartTalksInTrack(onlyTrack.id)
    : []
  const showsAllSameStart =
    sameStartTalks.length > 1 && sameStartTalks.length <= MAX_ROWS_AT_ONCE
  const trackIds =
    originalView && !showsAllSameStart
      ? originalView.allTracks.map((t) => t.id)
      : []
  const view = useSameStartRotation(originalView, seconds, trackIds)

  if (!view) return { view, ...EMPTY }
  const nextTalks = getOverlappingTalks(view)
  const baseTalk = Object.values(nextTalks)[0]
  if (!baseTalk) return { view, ...EMPTY }

  const hideOthers = HIDE_OTHER_TRACKS_TALK_IDS.includes(view.selectedTalk.id)
  const tracksToShow = hideOthers
    ? view.allTracks.filter((t) => t.id === view.selectedTalk.trackId)
    : view.allTracks

  const rows: Page2TrackRow[] = []
  tracksToShow.forEach((track, i) => {
    const talks = showsAllSameStart
      ? sameStartTalks
      : nextTalks[track.name]
        ? [nextTalks[track.name]]
        : []
    talks.forEach((talk) => pushRow(track, talk, i))
  })

  function pushRow(track: Track, talk: Talk, i: number) {
    if (!view) return
    const colors = brand.page1.cardRotationBackgroundColors
    const rotationColor =
      colors.length > 0 && view.sameStartCountInTrack(track.id) > 1
        ? colors[view.sameStartIndexOf(talk) % colors.length]
        : null
    rows.push({
      talk,
      track,
      speakers: view.speakersOf(talk.id),
      trackIndex: i,
      rotationColor,
    })
  }

  return {
    view,
    showsAllSameStart,
    timeRange: { start: baseTalk.startTime, end: baseTalk.endTime },
    rows,
  }
}
