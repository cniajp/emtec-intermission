import { Talk } from '@/api/endpoint/talks'
import { Speaker } from '@/api/endpoint/speakers'
export type OnEnded = () => void

export interface ContentProperties {
  onEnded: OnEnded
  talkData: Talk | null
  speakersData: Speaker[] | null
}
