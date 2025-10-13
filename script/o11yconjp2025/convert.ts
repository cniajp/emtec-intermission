// このファイルは事前にデータのコンバートを行うためのスクリプトです。
// 実行コマンド: just o11yconjp2025
// もしくは
// 実行コマンド: npx tsx ./script/o11yconjp2025/convert.ts -y && npm run fmt

import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exportEventData } from '../common/utils.js'
import { Track, Speaker, Talk } from '../../src/data/types.js'
import {
  sessioniseRoom,
  sessioniseSpeaker,
  sessioniseTalk,
  OverridesTalk,
  OverridesSpeaker,
} from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const file_path = path.join(__dirname, './src/all.json')
const overrides_path = path.join(__dirname, './src/overrides.json')

const DEFAULT_IMAGE_PATH: string =
  'https://pbs.twimg.com/profile_images/1953665800411525120/lbqP5cJi_400x400.png'

// 非表示にするTalkのIDのリスト
const hiddenTalkIds = new Set<string>([
  '9b978691-f832-41a9-a5fd-a367ccf8075a', // 開場
  '2e4cc4d3-a310-4b12-aff1-a105185e567d', // 懇親会
])

// フルネームを使うIDのリスト
const fullNameList: string[] = [
  '6b59f1bf-7e0a-4c51-89ff-b767831ee37f',
  'keynote-speaker',
  'staff-member',
]

// 追加スピーカー
const addSpeakers = [
  {
    id: 'staff-member',
    firstName: '',
    lastName: '',
    bio: '',
    tagLine: 'Observability Conference Tokyo',
    profilePicture: DEFAULT_IMAGE_PATH,
    isTopSpeaker: false,
    links: null,
    sessions: [],
    fullName: '運営メンバー',
    categoryItems: null,
    questionAnswer: null,
  },
  {
    id: 'unknown-speaker',
    firstName: '',
    lastName: '',
    bio: '',
    tagLine: '未定',
    profilePicture: DEFAULT_IMAGE_PATH,
    isTopSpeaker: false,
    links: null,
    sessions: [],
    fullName: '未定',
    categoryItems: null,
    questionAnswer: null,
  },
]

// JSONファイルの読み込み
const rawData = fs.readFileSync(file_path, 'utf-8')
const rawOverrides = fs.readFileSync(overrides_path, 'utf-8')

const data: {
  rooms: sessioniseRoom[]
  speakers: sessioniseSpeaker[]
  sessions: sessioniseTalk[]
} = JSON.parse(rawData)

const overrides: {
  sessions: { [key: string]: OverridesTalk }
  speakers: { [key: string]: OverridesSpeaker }
  rooms: object[]
} = JSON.parse(rawOverrides)

const dataRooms: sessioniseRoom[] = data.rooms
const dataSpeakers: sessioniseSpeaker[] = data.speakers
const dataTalks: sessioniseTalk[] = data.sessions

// データの上書き
Object.entries(overrides.sessions).forEach(
  ([key, value]: [string, OverridesTalk]) => {
    const talk = dataTalks.find((t) => t.id === key)
    if (talk) {
      talk.title = value.title
      talk.description = value.description
      talk.speakers = value.speakers
    }
  }
)

Object.entries(overrides.speakers).forEach(
  ([key, value]: [string, OverridesSpeaker]) => {
    const speaker = dataSpeakers.find((s) => s.id === key)
    if (speaker) {
      Object.assign(speaker, value)
    } else {
      dataSpeakers.push({
        id: key,
        firstName: value.firstName,
        lastName: value.lastName,
        bio: value.bio,
        tagLine: value.tagLine,
        profilePicture: value.profilePicture
          ? `/o11yconjp2025${value.profilePicture.split('.').shift()}.jpg`
          : DEFAULT_IMAGE_PATH,
        isTopSpeaker: false,
        links: value.links,
        sessions: dataTalks
          .filter((talk) => talk.speakers?.includes(key))
          .map((talk) => talk.id),
        fullName: value.name,
        categoryItems: null,
        questionAnswer: null,
      })
    }
  }
)

// 追加スピーカーの追加
addSpeakers.forEach((newSpeaker) => {
  dataSpeakers.push(newSpeaker)
})

// 特定のTalkに話者を追加
dataTalks.forEach((talk) => {
  switch (talk.id) {
    case 'c71ae548-0a4b-4adb-8f9a-dcb8dc9ac8e7': // オープニング
      talk.speakers = ['staff-member']
      break
    default:
      break
  }

  // 話者未設定のTalkにはunknown-speakerを設定
  if (talk.speakers && talk.speakers.length === 0) {
    talk.speakers = ['unknown-speaker']
  }
})

console.log(dataRooms.length)
console.log(dataSpeakers.length)
console.log(dataTalks.length)

// sort順に並び替えてidを振り直す
dataRooms.sort((a, b) => a.sort - b.sort)
const tracks: Track[] = dataRooms.map((room, index) => {
  return {
    id: index + 1,
    name: room.name.replace('track', '').replace('Track', '').trim(),
  }
})

const trackIdMap: { [key: number]: number } = {}
dataRooms.forEach((room, index) => {
  trackIdMap[room.id] = index + 1
})

const speakers: Speaker[] = dataSpeakers.map((speaker, index) => {
  return {
    id: index + 1,
    name: fullNameList.includes(speaker.id)
      ? speaker.fullName
      : speaker.lastName + ' ' + speaker.firstName,
    company: speaker.tagLine,
    avatarUrl: speaker.profilePicture,
  }
})

// speakerのIDの対応表も作る
const speakerIdMap: { [key: string]: number } = {}
dataSpeakers.forEach((speaker, index) => {
  speakerIdMap[speaker.id] = index + 1
})

// id はRoomのIDを百の位にして、部屋の中での登壇時間順の連番を一の位にする
// 先にデータをroomIdでグループ化してから、各グループ内でstartsAt順にソートしてidを振り直す方法もあるが、今回は単純に元データの順番で処理する
const talks: Talk[] = []
dataTalks
  .filter((talk) => !hiddenTalkIds.has(talk.id))
  .forEach((talk) => {
    // 話者IDの変換は対応表を使う
    let talkSpeakers: { id?: number; name?: string }[] = []
    if (talk.speakers && talk.speakers.length > 0) {
      talkSpeakers = talk.speakers.map((rawSpeakerId: string) => {
        const speakerId = speakerIdMap[rawSpeakerId]
        const speaker = speakers.find((sp) => sp.id === speakerId)
        if (speaker) {
          return { id: speakerId, name: speaker.name }
        }
        console.warn(`Speaker ID ${rawSpeakerId} not found in speakerIdMap.`)
        return { id: undefined, name: undefined }
      })
    } else {
      console.warn(`Talk ID ${talk.id}(${talk.title}) has no speakers.`)
    }

    const trackId = trackIdMap[talk.roomId] || 0
    const talkCountInTrack = talks.filter((t) => t.trackId === trackId).length
    const talkData: Talk = {
      id: trackId * 100 + (talkCountInTrack + 1),
      trackId: trackId,
      title: talk.title,
      abstract: talk.description || '',
      speakers: talkSpeakers,
      startTime: talk.startsAt,
      endTime: talk.endsAt,
      conferenceDayId: 1,
    }
    talks.push(talkData)
  })

// 最終的なデータをオブジェクトにまとめる
const finalData = {
  tracks: tracks,
  speakers: speakers,
  talks: talks,
}

// tsファイルとして保存(TypeScriptの定数として使えるように)
exportEventData(finalData)
