export type forteeProposal = {
  uuid: string
  url: string
  title: string
  abstract: string
  accepted: boolean
  speaker: forteeSpeaker
  created: string
  timetable: timetable
  video_url?: string
  feedback: {
    open: boolean
  }
}

export type forteeTimetableItem = {
  type: string
  uuid: string
  url?: string
  title: string
  abstract?: string | null
  accepted?: boolean
  track: {
    name: string
    sort: number
  }
  starts_at: string
  length_min: number
  tags?: string[]
  speaker?: forteeSpeaker
  fav?: boolean
  fav_count?: number
  feedback?: {
    open: boolean
  }
}

export type forteeTimetable = {
  timetable: forteeTimetableItem[]
}

export type forteeSpeaker = {
  name: string
  kana: string
  twitter: string
  avatar_url: string
}

export type timetable = {
  track: string
  starts_at: string
  length_min: number
}

// 公式サイト由来の登壇者情報。fortee 側に無い・表記が違うものを補う
export type OverridesSessionSpeaker = {
  // 表示名。fortee の登録名より優先される
  name?: string | null
  // fortee に avatar_url が無いときだけ使われる
  avatarUrl?: string | null
}

// fortee に timetable がないセッションを手で補完するための型
// 実体: script/fortee/src/overrides.json
export type OverridesTimetable = {
  track?: string | null
  starts_at?: string | null
  length_min?: number | null
  speaker?: OverridesSessionSpeaker | null
  // アンダースコア始まりのキーは注釈。変換時は無視される
  _title?: string
  _todo?: string
}

export type OverridesExtraSpeaker = {
  name: string
  company?: string | null
}

// fortee に存在しない枠（オープニング・招待講演・スポンサーセッション等）
export type OverridesExtra = {
  _todo?: string
  // false の枠は talks.ts に出力しない（受付開始・開場・撤収など）
  enabled: boolean
  // 9000番台。自動生成されるIDと衝突させない
  id: number
  track?: string | null
  starts_at?: string | null
  length_min?: number | null
  title: string
  abstract?: string
  speaker?: OverridesExtraSpeaker | null
}

export type ForteeOverrides = {
  _note?: string
  sessions: Record<string, OverridesTimetable>
  extras?: Record<string, OverridesExtra>
}
