// JANOGのAPIデータを元に、セッション・スピーカー情報を生成するスクリプト
// APIエンドポイント:
//   - https://ai-chat.janog57.sakura.ad.jp/api/rooms/
//   - https://ai-chat.janog57.sakura.ad.jp/api/programs/
//   - https://ai-chat.janog57.sakura.ad.jp/api/speakers/
// 変換先フォーマット: src/data/xxx.ts (Track, Speaker, Talk)
// 実行コマンド: npx tsx ./script/janog/convert.ts && npm run fmt

import { janogProgramItem, janogSpeaker, janogRoom } from './type.js'
import { Track, Speaker, Talk } from '../../src/data/types.js'
import { exportEventData } from '../common/utils.js'

const API_BASE_URL: string = 'https://ai-chat.janog57.sakura.ad.jp/api'

const eventImageUrl: string =
  'https://www.janog.gr.jp/meeting/janog57/wp-content/uploads/2024/11/JANOG57-logo.png'

const conferenceDays = [
  { id: 1, date: '2026-02-11' },
  { id: 2, date: '2026-02-12' },
  { id: 3, date: '2026-02-13' },
]

// 手動で追加するトーク（最小限の情報）
// IDは 9000番台を使用して自動生成されるIDと重複を避ける
const manualTalks: Partial<Talk>[] = [
  // 必要に応じて追加
]

/**
 * メイン処理関数
 */
async function main() {
  // APIからデータを取得する
  const [rooms, programs, speakersData] = await Promise.all([
    fetchRooms(),
    fetchPrograms(),
    fetchSpeakers(),
  ])

  // Track情報を生成する
  const tracks: Track[] = convertToTracks(rooms)

  // Speaker情報を生成する（id:0でJANOG57を追加）
  const speakers: Speaker[] = [
    {
      id: 0,
      name: 'JANOG57',
      avatarUrl: eventImageUrl,
    },
    ...convertToSpeakers(speakersData),
  ]

  // Talk情報を生成する
  const talks: Talk[] = convertToTalks(programs, speakers, rooms)

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
 * Rooms APIからデータを取得する
 */
async function fetchRooms(): Promise<janogRoom[]> {
  const url = `${API_BASE_URL}/rooms/`
  const data: janogRoom[] = await fetch(url).then((res) => res.json())
  return data
}

/**
 * Programs APIからデータを取得する
 */
async function fetchPrograms(): Promise<janogProgramItem[]> {
  const url = `${API_BASE_URL}/programs/`
  const data: janogProgramItem[] = await fetch(url).then((res) => res.json())
  return data
}

/**
 * Speakers APIからデータを取得する
 */
async function fetchSpeakers(): Promise<janogSpeaker[]> {
  const url = `${API_BASE_URL}/speakers/`
  const data: janogSpeaker[] = await fetch(url).then((res) => res.json())
  return data
}

/**
 * RoomデータからTrack情報を生成する
 */
function convertToTracks(rooms: janogRoom[]): Track[] {
  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    hashTag: room.name.replace(/\s+/g, ''),
  }))
}

/**
 * SpeakerデータからSpeaker情報を生成する
 */
function convertToSpeakers(speakersData: janogSpeaker[]): Speaker[] {
  const DEFAULT_IMAGE_PATH: string = eventImageUrl

  return speakersData.map((speaker) => ({
    id: speaker.id,
    name: speaker.name,
    avatarUrl: speaker.avatar_url || DEFAULT_IMAGE_PATH,
  }))
}

/**
 * プログラムデータからTalk情報を生成する
 */
function convertToTalks(
  programs: janogProgramItem[],
  speakers: Speaker[],
  rooms: janogRoom[]
): Talk[] {
  const convertedTalks: Talk[] = []

  programs
    .sort((a, b) => {
      // 日付と開始時間でソート
      const aDateTime = `${a.date}T${a.start_time}`
      const bDateTime = `${b.date}T${b.start_time}`
      if (aDateTime < bDateTime) return -1
      if (aDateTime > bDateTime) return 1
      return 0
    })
    .forEach((program) => {
      const room = rooms.find((r) => r.id === program.room.id)
      if (!room) {
        console.warn(
          `No room found for program: ${program.title} (room id: ${program.room.id})`
        )
        return
      }

      // スピーカー情報を取得（いない場合は「JANOG57」を割り当て）
      const talkSpeakers =
        program.speakers && program.speakers.length > 0
          ? program.speakers.map((s: janogSpeaker) => {
              const speaker = speakers.find((sp) => sp.id === s.id)
              return {
                id: speaker?.id || s.id,
                name: speaker?.name || s.name,
              }
            })
          : [{ id: 0, name: 'JANOG57' }]

      // startTimeとendTimeを生成（ISO 8601形式）
      // APIが HH:MM:SS 形式を返す場合はそのまま、HH:MM 形式なら :00 を追加
      const formatTime = (time: string) =>
        time.split(':').length === 2 ? `${time}:00` : time
      const startTime = `${program.date}T${formatTime(program.start_time)}+09:00`
      const endTime = `${program.date}T${formatTime(program.end_time)}+09:00`

      convertedTalks.push({
        id: program.id,
        trackId: room.id,
        title: program.title,
        abstract: program.abstract?.replace(/[\r\t\n]/g, '') || '',
        speakers: talkSpeakers,
        startTime,
        endTime,
        conferenceDayId: conferenceDays.find((day) => program.date === day.date)
          ?.id,
      } as Talk)
    })

  return convertedTalks
}

main().catch(console.error)
