import config from '@/config'
import type { Optional } from '@/utils/types'
import type { Speaker, Talk, Track } from '@/data/types'
import type { TalkView } from '@/logic/models/talkView'
import { usePageDisplayTelemetry } from '@/logic/page-flow/usePageTelemetry'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'
import { getOverlappingTalks } from './getOverlappingTalks'

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
  timeRange: { start: string; end: string } | null
  rows: Page2TrackRow[]
}

const EMPTY_VM: Page2ViewModel = { timeRange: null, rows: [] }

export function usePage2ViewModel(view: Optional<TalkView>): Page2ViewModel {
  usePageDisplayTelemetry('Page2')
  useTimedPageTransition('Page2', config.transTimePage2)

  if (!view) return EMPTY_VM
  const nextTalks = getOverlappingTalks(view)
  const baseTalk = Object.values(nextTalks)[0]
  if (!baseTalk) return EMPTY_VM

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
    timeRange: { start: baseTalk.startTime, end: baseTalk.endTime },
    rows,
  }
}
