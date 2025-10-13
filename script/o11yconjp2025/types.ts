export type sessioniseRoom = {
  id: number
  name: string
  sort: number
}
export type sessioniseSpeaker = {
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
export type sessioniseTalk = {
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
export type OverridesTalk = {
  title: string
  description: string
  isLunchSession: boolean
  sponsorName: string | null
  tags: string[] | null
  speakers: string[] | null
}
export type OverridesSpeaker = {
  name: string
  firstName: string
  lastName: string
  bio: string
  tagLine: string
  profilePicture: string
  links: object[] | null
}
