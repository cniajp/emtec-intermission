type sessioniseRoom = {
  id: number
  name: string
  sort: number
}
type sessioniseSpeaker = {
  id: string
  firstName: string
  lastName: string
  bio: string | null
  tagLine: string | null
  profilePicture: string | null
  isTopSpeaker: boolean
  links?: object[] | null
  sessions: string[]
  fullName: string
  categoryItems?: object[] | null
  questionAnswer?: object[] | null
}
type sessioniseTalk = {
  id: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  isServiceSession: boolean
  isPlenumSession: boolean
  speakers: string[] | null
  categoryItems: object[] | null
  questionAnswers: object[] | null
  roomId: number
  liveUrl: string | null
  recordingUrl: string | null
  status: string | null
  isInformed: boolean
  isConfirmed: boolean
}
type OverridesTalk = {
  title: string
  description: string
  isLunchSession: boolean
  sponsorName: string | null
  tags: string[] | null
  speakers: string[] | null
}
type OverridesSpeaker = {
  name: string
  firstName: string
  lastName: string
  bio: string
  tagLine: string
  profilePicture: string
  links: object[] | null
}
type appTrack = {
  id: number
  name: string
}
type appSpeaker = {
  id: number
  name: string
  company?: (string | null) | undefined
  avatarUrl?: (string | null) | undefined
}
type appTalk = {
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
  talkDifficulty?: string | undefined
  talkCategory?: string | undefined
  conferenceDayId?: (number | null) | undefined
  showOnTimetable?: boolean | undefined
}

export {
  sessioniseRoom,
  sessioniseSpeaker,
  sessioniseTalk,
  OverridesTalk,
  OverridesSpeaker,
  appTrack,
  appSpeaker,
  appTalk,
}
