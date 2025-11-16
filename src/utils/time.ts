import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.tz.setDefault('Asia/Tokyo')

interface ServerTimeResponse {
  timestamp: string
  timezone: string
  unix: number
  milliseconds: number
}

// Configuration constants - easy to modify
const TIME_SYNC_CONFIG = {
  RETRY_INTERVAL: 5000, // 5 seconds between retries
  MAX_ATTEMPTS: 6, // Maximum retry attempts (30 seconds total)
  SIGNIFICANT_DRIFT_THRESHOLD: 30000, // 30 seconds
} as const

let timeOffset: number = 0
let isSynced: boolean = false
let syncAttempts: number = 0
let syncInterval: NodeJS.Timeout | null = null

async function attemptTimeSync(): Promise<boolean> {
  try {
    const response = await fetch('/api/time')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data: ServerTimeResponse = await response.json()
    const serverTime = dayjs(data.timestamp).tz('Asia/Tokyo')
    const localTime = dayjs().tz('Asia/Tokyo')

    timeOffset = serverTime.diff(localTime)
    isSynced = true

    console.log(`Time synced successfully. Offset: ${timeOffset}ms`)
    return true
  } catch (error) {
    console.warn(`Time sync attempt ${syncAttempts + 1} failed:`, error)
    return false
  }
}

export function startTimeSync(): void {
  if (syncInterval) return // Already started

  syncInterval = setInterval(async () => {
    syncAttempts++

    const success = await attemptTimeSync()

    if (success || syncAttempts >= TIME_SYNC_CONFIG.MAX_ATTEMPTS) {
      if (syncInterval) {
        clearInterval(syncInterval)
        syncInterval = null
      }

      if (!success) {
        console.warn(
          `Time sync failed after ${(TIME_SYNC_CONFIG.MAX_ATTEMPTS * TIME_SYNC_CONFIG.RETRY_INTERVAL) / 1000} seconds, using local time`
        )
      }
    }
  }, TIME_SYNC_CONFIG.RETRY_INTERVAL)

  // Also try immediately
  attemptTimeSync().then((success) => {
    if (success && syncInterval) {
      clearInterval(syncInterval)
      syncInterval = null
    }
  })
}

export function getAccurateTime(): Dayjs {
  const localTime = dayjs().tz('Asia/Tokyo')
  return isSynced ? localTime.add(timeOffset, 'millisecond') : localTime
}

export function getTimeDrift(): number {
  return timeOffset
}

export function hasSignificantDrift(): boolean {
  return Math.abs(timeOffset) > TIME_SYNC_CONFIG.SIGNIFICANT_DRIFT_THRESHOLD
}

export function isTimeSynced(): boolean {
  return isSynced
}

export function getTimeStr(time: string): string {
  return dayjs(time).tz().format('HH:mm')
}

export function getTime(time: string) {
  return dayjs(time).tz()
}

export function now(): Dayjs {
  return dayjs().tz()
}

export function nowAccurate(): Dayjs {
  return getAccurateTime()
}
