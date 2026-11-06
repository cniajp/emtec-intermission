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
}

export type Page2ViewModel = {
  // 同時刻セッションの切り替えを反映した view（Presenter にはこちらを渡す）
  view: Optional<TalkView>
  timeRange: { start: string; end: string } | null
  rows: Page2TrackRow[]
}

const EMPTY = { timeRange: null, rows: [] }

export function usePage2ViewModel(
  originalView: Optional<TalkView>
): Page2ViewModel {
  const brand = useBrand()
  const seconds = config.transTimePage2 ?? brand.page2.seconds
  useTimedPageTransition('Page2', seconds)
  const trackIds = originalView ? originalView.allTracks.map((t) => t.id) : []
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
    const talk = nextTalks[track.name]
    if (!talk) return
    rows.push({
      talk,
      track,
      speakers: view.speakersOf(talk.id),
      trackIndex: i,
    })
  })

  return {
    view,
    timeRange: { start: baseTalk.startTime, end: baseTalk.endTime },
    rows,
  }
}
