export type janogRoom = {
  id: number
  name: string
  location: string
}

export type janogProgramItem = {
  id: number
  title: string
  date: string
  start_time: string
  end_time: string
  room: janogRoom
  speakers: janogSpeaker[]
  abstract: string
  url: string
}

export type janogSpeaker = {
  id: number
  name: string
  company: string
  avatar_url: string
  program: number
  ordering: number
}
