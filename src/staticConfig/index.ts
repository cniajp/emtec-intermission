import { breakConfig } from './break'
import { breakDkConfig } from './breakDk'

export const staticConfig = {
  break: breakConfig,
  breakDk: breakDkConfig,
} as const

export { buildPage3Images } from './shared'
export type { TrackImageInsert, TrackImageInserts } from './shared'
