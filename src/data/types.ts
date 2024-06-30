export type Talk = {
  id: number
  trackId: number
  title: string
  abstract: string
  speakers: {
    id?: number | undefined
    name?: string | undefined
  }[]
  startTime: string
  endTime: string
  talkDifficulty: string
  talkCategory: string
  conferenceDayId?: (number | null) | undefined
  showOnTimetable?: boolean | undefined
}

export type Track = {
  id: number
  name: string
}

export type Speaker = {
  id: number
  name: string
  company?: (string | null) | undefined
  avatarUrl?: (string | null) | undefined
}
