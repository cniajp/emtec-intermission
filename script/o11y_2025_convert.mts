// このファイルは事前にデータのコンバートを行うためのスクリプトです。
// 実行には Node.js と TypeScript の環境が必要です。
// 実行コマンド: npx ts-node script/o11y-2025-convert.ts

const file_path: string = './data/o11y_2025/all.json'

import * as fs from 'fs'

// JSONファイルの読み込み
const rawData = fs.readFileSync(file_path, 'utf-8')
const data = JSON.parse(rawData)
// console.log(data)

// まずはdataを項目ごとに型を定義して分割

type rawRoom = {
  id: number
  name: string
  sort: number
}

type rawSpeaker = {
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

type rawTalk = {
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

const dataRooms: rawRoom[] = data.rooms
const dataSpeakers: rawSpeaker[] = data.speakers
const dataTalks: rawTalk[] = data.sessions

console.log(dataRooms.length)
console.log(dataSpeakers.length)
console.log(dataTalks.length)

// 型定義
type Track = {
  id: number
  name: string
}

// sort順に並び替えてidを振り直す
// IDの対応表も作る
dataRooms.sort((a, b) => a.sort - b.sort)
const tracks: Track[] = dataRooms.map((room, index) => {
  return {
    id: index + 1,
    name: room.name,
  }
})

// console.log(tracks)

const trackIdMap: { [key: number]: number } = {}
dataRooms.forEach((room, index) => {
  trackIdMap[room.id] = index + 1
})
// console.log(trackIdMap)

// speakerの変換
export type Speaker = {
  id: number
  name: string
  company?: (string | null) | undefined
  avatarUrl?: (string | null) | undefined
}

const fullNameList: string[] = ['6b59f1bf-7e0a-4c51-89ff-b767831ee37f']

let speakers: Speaker[] = dataSpeakers.map((speaker, index) => {
  return {
    id: index + 1,
    name: fullNameList.includes(speaker.id)
      ? speaker.fullName
      : speaker.lastName + ' ' + speaker.firstName,
    company: speaker.tagLine,
    avatarUrl: speaker.profilePicture,
  }
})

speakers = speakers.concat([
  {
    id: 0,
    name: '運営メンバー',
    company: 'Observability Conference Tokyo',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1953665800411525120/lbqP5cJi_400x400.png',
  },
  {
    id: 999,
    name: '未定',
    company: null,
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1953665800411525120/lbqP5cJi_400x400.png',
  },
])

// console.log(speakers)

// speakerのIDの対応表も作る
const speakerIdMap: { [key: string]: number } = {}
dataSpeakers.forEach((speaker, index) => {
  speakerIdMap[speaker.id] = index + 1
})
// console.log(speakerIdMap)

// talkの変換
export type Talk = {
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

const disableTalkIds = new Set<string>([
  // 無効にするTalkのIDをここに追加
  '9b978691-f832-41a9-a5fd-a367ccf8075a',
  '2e4cc4d3-a310-4b12-aff1-a105185e567d',
])

const staffTalkIds = new Set<string>([
  // スタッフ扱いにするTalkのIDをここに追加
  'c71ae548-0a4b-4adb-8f9a-dcb8dc9ac8e7',
  '13c12567-e6ba-4ce0-acd9-5ba4edea5781',
])

// id はRoomのIDを百の位にして、部屋の中での登壇時間順の連番を一の位にする
// 先にデータをroomIdでグループ化してから、各グループ内でstartsAt順にソートしてidを振り直す方法もあるが、今回は単純に元データの順番で処理する
const talks: Talk[] = []
dataTalks
  .filter((talk) => !disableTalkIds.has(talk.id))
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
    } else if (staffTalkIds.has(talk.id)) {
      talkSpeakers = speakers
        .filter((sp) => sp.id === 0)
        .map((sp) => ({ id: sp.id, name: sp.name }))
    } else {
      talkSpeakers = [{ id: 999, name: '未定' }]
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

// console.log(talks)

// 最終的なデータをオブジェクトにまとめる
const finalData = {
  tracks: tracks,
  speakers: speakers,
  talks: talks,
}

// JSONファイルとして保存
const outputPath = './data/o11y_2025/converted_data.json'
fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8')
console.log(`Converted data has been saved to ${outputPath}`)
