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
