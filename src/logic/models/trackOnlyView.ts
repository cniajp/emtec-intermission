import type { Talk, Track } from '@/data/types'
import { TalkView } from './talkView'

type Params = {
  // ヘッダーに出すトラック名
  trackName?: string
  // トラック別の Page3 画像（page3.trackImages）を引くための ID
  trackId?: number
  // 既知のトラック一覧（静的データ版）。名前か ID が一致すればその定義（hashTag など）を使う
  tracks?: ReadonlyArray<Track>
}

// 仮のトークの ID。実在のトークや excludedTalks と重ならない値にする
const PLACEHOLDER_TALK_ID = -1

/**
 * トーク情報なしで、トラック名だけを持つ TalkView を作る。
 * セッション情報を出さないページ（/break/cm, /break-dk/cm）が、API や talks データに頼らずに
 * ヘッダー（トラック名・ハッシュタグ）と Page3 を出すためのもの。
 */
export function makeTrackOnlyView({
  trackName = '',
  trackId,
  tracks = [],
}: Params): TalkView {
  const name = trackName.trim()
  const known = tracks.find(
    (t) =>
      (trackId != null && t.id === trackId) ||
      (name !== '' && t.name.toLowerCase() === name.toLowerCase())
  )
  const track: Track = known
    ? { ...known, name: name || known.name }
    : { id: trackId ?? 0, name }
  // ヘッダーは「同じトラックの残りのトーク」が1本も無いと何も出さないので、仮のトークを1本置く
  const talk: Talk = {
    id: PLACEHOLDER_TALK_ID,
    trackId: track.id,
    title: '',
    abstract: '',
    speakers: [],
    startTime: '2000-01-01T00:00:00+09:00',
    endTime: '2000-01-01T00:00:00+09:00',
    showOnTimetable: true,
  }
  return new TalkView(talk, [talk], [track], [])
}
