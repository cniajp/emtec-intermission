// default テーマのデザイントークン。色・パスなどここで一元管理する。

// Page2 の TrackRow バッジ色 (i % N でローテーション)
export const TRACK_BG_COLORS: ReadonlyArray<string> = [
  '#f14e35',
  '#387c61',
  '#e5b73d',
]

// Page2 の UPCOMING SESSIONS ボード背景 (arbitrary Tailwind値を JSX 側から追い出す)
export const UPCOMING_SESSIONS_BG_URL = '/cnk2026/background.jpg'

// Page1 Main の UPCOMING SESSION ボード
export const UPCOMING_SESSION_BG_URL = '/cnk2026/background.jpg'

// Page1 Main のセッションカード配色 (現行踏襲)
export const PAGE1_CARD_BG = '#387c61'
export const PAGE1_CARD_HEADER_BG = '#1E1E1E'

export const TEXT_COLOR_PRIMARY = '#1E1E1E'
