// Forteeのプロポーザルデータを元に、セッション・スピーカー情報を生成するスクリプト
// 変換元API: https://fortee.jp/{EVENT_ALIAS}/api/proposals/accepted
// 変換先フォーマット: src/data/xxx.ts (Track, Speaker, Talk)
// 実行コマンド: just fortee
// もしくは
// 実行コマンド: npx tsx ./script/fortee/convert.ts -y && npm run fmt

import { forteeProposal, forteeTimetableItem } from './type.js'
import { Track, Speaker, Talk } from '../../src/data/types.js'
import { exportEventData } from '../common/utils.js'

const EVENT_ALIAS: string = 'sre-kaigi-2026'

const eventImageUrl: string = `https://fortee.jp/files/${EVENT_ALIAS}/image/avatar.jpg`

const conferenceDays = [{ id: 1, date: '2026-01-31' }]

// Track情報を生成する
const tracks: Track[] = [
  { id: 1, name: 'ホール', hashTag: 'HALL' },
  { id: 2, name: 'ルーム A', hashTag: 'RoomA' },
  { id: 3, name: 'ルーム B', hashTag: 'RoomB' },
]

// 手動で追加するトーク（最小限の情報）
// IDは 9000番台を使用して自動生成されるIDと重複を避ける
const manualTalks: Partial<Talk>[] = [
  {
    id: 9001,
    trackId: 1,
    title: '開会式',
    abstract: '',
    speakers: [{ id: 0, name: '運営' }],
    startTime: '2026-01-31T10:00:00+09:00',
    endTime: '2026-01-31T10:10:00+09:00',
    conferenceDayId: 1,
  },
  {
    id: 9002,
    trackId: 1,
    title: '閉会式',
    abstract: '',
    speakers: [{ id: 0, name: '運営' }],
    startTime: '2026-01-31T17:50:00+09:00',
    endTime: '2026-01-31T18:00:00+09:00',
    conferenceDayId: 1,
  },
]

/**
 * メイン処理関数
 */
async function main() {
  // APIからデータを取得する
  // const dataTalks: forteeProposal[] = await fetchProposalData()
  const dataTalks: forteeTimetableItem[] = await fetchTimetableData()

  // Speaker情報を生成する（id:0で運営を追加）
  const speakers: Speaker[] = [
    {
      id: 0,
      name: '運営',
      avatarUrl: eventImageUrl,
    },
    ...convertToSpeakers(dataTalks),
  ]

  // Talk情報を生成する
  const talks: Talk[] = convertToTalks(dataTalks, speakers)

  // 手動で追加したトークをマージ
  const allTalks: Talk[] = [...(manualTalks as Talk[]), ...talks].sort(
    (a, b) => {
      if (a.startTime < b.startTime) return -1
      if (a.startTime > b.startTime) return 1
      return 0
    }
  )

  // 最終データを組み立てる
  exportEventData({ tracks, speakers, talks: allTalks })
}

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

async function fetchTimetableData(): Promise<forteeTimetableItem[]> {
  const forteeApiTimetableUrl: string = `https://fortee.jp/${EVENT_ALIAS}/api/timetable`

  const data: { timetable: forteeTimetableItem[] } = await fetch(
    forteeApiTimetableUrl
  ).then((res) => res.json())

  return data.timetable
}

/**
 * プロポーザルデータからSpeaker情報を生成する
 */
function convertToSpeakers(
  proposals: forteeProposal[] | forteeTimetableItem[]
): Speaker[] {
  const DEFAULT_IMAGE_PATH: string = eventImageUrl

  const speakers: Speaker[] = []
  proposals.forEach((talk, index) => {
    // speakerが存在する場合のみ処理（timeslotにはspeakerがない）
    if ('speaker' in talk && talk.speaker) {
      speakers.push({
        id: index + 1,
        name: talk.speaker.name,
        avatarUrl: talk.speaker.avatar_url || DEFAULT_IMAGE_PATH,
      } as Speaker)
    }
  })
  return speakers
}

/**
 * プロポーザルデータからTalk情報を生成する
 */
function convertToTalks(
  proposals: forteeProposal[] | forteeTimetableItem[],
  speakers: Speaker[]
): Talk[] {
  const convertedTalks: Talk[] = []
  const trackIndexMap = new Map<number, number>()

  proposals
    .sort((a, b) => {
      // forteeProposalの場合はa.timetable.starts_at、forteeTimetableの場合はa.starts_at
      const aStartsAt =
        'starts_at' in a ? a.starts_at : a.timetable?.starts_at || ''
      const bStartsAt =
        'starts_at' in b ? b.starts_at : b.timetable?.starts_at || ''
      if (aStartsAt < bStartsAt) return -1
      if (aStartsAt > bStartsAt) return 1
      return 0
    })
    .forEach((talk) => {
      // forteeProposalの場合はtalk.timetable、forteeTimetableの場合はtalk自体
      let trackName: string
      let startsAt: string

      if ('starts_at' in talk) {
        // forteeTimetableの場合
        trackName = talk.track.name
        startsAt = talk.starts_at
      } else {
        // forteeProposalの場合
        if (!talk.timetable) {
          console.warn(`No timetable for talk: ${talk.title}`)
          return
        }
        trackName = talk.timetable.track
        startsAt = talk.timetable.starts_at
      }

      const track = tracks.find((t) => t.name === trackName)
      if (!track) {
        console.warn(`No track found for talk: ${talk.title}`)
        return
      }
      // speakerが存在しない場合はスキップ（timeslot等）
      if (!('speaker' in talk) || !talk.speaker) {
        return
      }

      const speaker = speakers.find((s) => s.name === talk.speaker?.name)
      if (!speaker) {
        console.warn(`No speaker found for talk: ${talk.title}`)
        return
      }

      // トラックごとのインデックスを取得・更新
      const trackIndex = trackIndexMap.get(track.id) || 0
      trackIndexMap.set(track.id, trackIndex + 1)

      // startTimeとendTimeを計算
      const startTime = startsAt
      const lengthMin =
        'starts_at' in talk ? talk.length_min : talk.timetable?.length_min || 0
      const endTime = new Date(
        new Date(startsAt).getTime() + lengthMin * 60000
      ).toISOString()

      convertedTalks.push({
        id: track.id * 100 + trackIndex + 1,
        trackId: track.id,
        title: talk.title,
        abstract: talk.abstract?.replace(/[\r\t\n]/g, '') || '',
        speakers: [{ id: speaker.id, name: speaker.name }],
        startTime,
        endTime,
        conferenceDayId: conferenceDays.find((day) =>
          startsAt.startsWith(day.date)
        )?.id,
      } as Talk)
    })

  return convertedTalks
}

main().catch(console.error)
