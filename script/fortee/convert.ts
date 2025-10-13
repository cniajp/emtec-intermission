import { forteeProposal } from './type.js'
import { Track, Speaker, Talk } from '../../src/data/types.js'
import { exportEventData } from '../common/utils.js'

const EVENT_ALIAS: string = 'phpconodawara-2025'

const conferenceDays = [
  { id: 1, date: '2025-04-11' },
  { id: 2, date: '2025-04-12' },
]

// Track情報を生成する
const tracks: Track[] = [
  { id: 1, name: 'かま' },
  { id: 2, name: 'ぼこ' },
  { id: 3, name: 'あじ' },
]

/**
 * ForteeのAPIからプロポーザルデータを取得する
 */
async function fetchProposalData(): Promise<forteeProposal[]> {
  const forteeApiProposalsUrl: string = `https://fortee.jp/${EVENT_ALIAS}/api/proposals/accepted`

  const data: { proposals: forteeProposal[] } = await fetch(
    forteeApiProposalsUrl
  ).then((res) => res.json())

  return data.proposals
}

/**
 * プロポーザルデータからSpeaker情報を生成する
 */
function convertToSpeakers(proposals: forteeProposal[]): Speaker[] {
  const DEFAULT_IMAGE_PATH: string = `https://fortee.jp/files/${EVENT_ALIAS}/image/avatar.png`

  const speakers: Speaker[] = []
  proposals.forEach((talk, index) => {
    speakers.push({
      id: index + 1,
      name: talk.speaker.name,
      avatarUrl: talk.speaker.avatar_url || DEFAULT_IMAGE_PATH,
    } as Speaker)
  })
  return speakers
}

/**
 * プロポーザルデータからTalk情報を生成する
 */
function convertToTalks(
  proposals: forteeProposal[],
  speakers: Speaker[]
): Talk[] {
  const convertedTalks: Talk[] = []

  proposals
    .sort((a, b) => {
      if (a.timetable.starts_at < b.timetable.starts_at) return -1
      if (a.timetable.starts_at > b.timetable.starts_at) return 1
      return 0
    })
    .forEach((talk, index) => {
      if (!talk.timetable) {
        console.warn(`No timetable for talk: ${talk.title}`)
        return
      }
      const track = tracks.find((t) => t.name === talk.timetable.track)
      if (!track) {
        console.warn(`No track found for talk: ${talk.title}`)
        return
      }
      const speaker = speakers.find((s) => s.name === talk.speaker.name)
      if (!speaker) {
        console.warn(`No speaker found for talk: ${talk.title}`)
        return
      }
      convertedTalks.push({
        id: track.id * 100 + index + 1,
        trackId: track.id,
        title: talk.title,
        abstract: talk.abstract.replace(/[\r\t\n]/g, ''),
        speakers: [{ id: speaker.id, name: speaker.name }],
        startTime: talk.timetable.starts_at,
        endTime: new Date(
          new Date(talk.timetable.starts_at).getTime() +
            talk.timetable.length_min * 60000
        ).toISOString(),
        conferenceDayId: conferenceDays.find((day) =>
          talk.timetable.starts_at.startsWith(day.date)
        )?.id,
      } as Talk)
    })

  return convertedTalks
}

async function main() {
  // APIからデータを取得する
  const dataTalks: forteeProposal[] = await fetchProposalData()

  // Speaker情報を生成する
  const speakers: Speaker[] = convertToSpeakers(dataTalks)

  // Talk情報を生成する
  const talks: Talk[] = convertToTalks(dataTalks, speakers)

  // 最終データを組み立てる
  exportEventData({ tracks, speakers, talks })
}

main().catch(console.error)
