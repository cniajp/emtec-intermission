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
