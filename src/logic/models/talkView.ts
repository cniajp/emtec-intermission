import config from '@/config'
import type { Speaker, Talk, Track } from '@/data/types'
import { getTime } from '@/utils/time'
import { Optional } from '@/utils/types'
import dayjs, { Dayjs } from 'dayjs'

export class TalkView {
  readonly selectedTalk: Talk
  readonly selectedTrack: Track
  readonly allTalks: Talk[]
  readonly allTracks: Track[]
  readonly speakers: Speaker[]
  // 同じトラックで次に始まるトークが同じ開始時刻で複数あるとき、何番目を先頭にするか。
  // Page1/Page2 がこの値を進めて、同時刻のセッションを順番に表示する
  readonly rotation: number

  constructor(
    talk: Talk,
    talks: Talk[],
    tracks: Track[],
    speakers: Speaker[],
    rotation = 0
  ) {
    this.rotation = rotation
    this.selectedTalk = talk
    this.allTalks = Array.from(talks).sort((a, b) => a.id - b.id)
    this.allTracks = Array.from(tracks).sort((a, b) => a.id - b.id)
    this.speakers = Array.from(speakers).sort((a, b) => a.id - b.id)
    this.selectedTrack = this.allTracks.find(
      (track) => track.id === talk.trackId
    )!
  }

  static withoutDk(
    talkId: string,
    talks: Talk[],
    tracks: Track[],
    speakers: Speaker[]
  ): TalkView {
    const selectedTalk = talks.find((talk) => talk.id.toString() === talkId)
    if (!selectedTalk) {
      throw new Error(`Talk not found: ${talkId}`)
    }
    const dayId = selectedTalk.conferenceDayId
    return new TalkView(
      selectedTalk,
      talks
        .filter((t) => t.conferenceDayId && t.conferenceDayId === dayId)
        .map((t) => ({ ...t, showOnTimetable: true })),
      tracks,
      speakers
    )
  }

  private allTalksOnTimeTable(): Talk[] {
    return this.allTalks.filter(
      (talk) => talk.showOnTimetable && !config.excludedTalks.includes(talk.id)
    )
  }

  private talksInTrack(trackId: number): Talk[] {
    const talks = this.allTalksOnTimeTable().filter(
      (t) => t.trackId === trackId
    )
    return talks.sort((a, b) => getTime(a.startTime).diff(getTime(b.startTime)))
  }

  // 先頭の「同じ開始時刻のトーク群」は rotation 分だけ回した順で返す
  private talksLeftInTrack(trackId: number): Talk[] {
    const left = this.unrotatedTalksLeftInTrack(trackId)
    const group = this.leadingSameStartGroup(left)
    if (group.length <= 1) return left
    const n = this.rotation % group.length
    return [
      ...group.slice(n),
      ...group.slice(0, n),
      ...left.slice(group.length),
    ]
  }

  private unrotatedTalksLeftInTrack(trackId: number): Talk[] {
    const afterFrom = getTime(this.selectedTalk.startTime)
    return this.talksInTrack(trackId).filter(
      (t) => getTime(t.startTime) >= afterFrom
    )
  }

  private leadingSameStartGroup(talks: Talk[]): Talk[] {
    const first = talks[0]
    if (!first) return []
    const start = getTime(first.startTime)
    return talks.filter((t) => getTime(t.startTime).isSame(start))
  }

  // 次に始まる同時刻のトークの本数（1 以下なら切り替え不要）
  sameStartCountInTrack(trackId: number): number {
    return this.leadingSameStartGroup(this.unrotatedTalksLeftInTrack(trackId))
      .length
  }

  // 次に始まる同時刻のトーク群（rotation に関係なく元の順番）
  sameStartTalksInTrack(trackId: number): Talk[] {
    return this.leadingSameStartGroup(this.unrotatedTalksLeftInTrack(trackId))
  }

  // 次に始まる同時刻のトーク群の中での順番（rotation に関係なく固定）。群に無ければ 0
  sameStartIndexOf(talk: Talk): number {
    const group = this.leadingSameStartGroup(
      this.unrotatedTalksLeftInTrack(talk.trackId)
    )
    return Math.max(
      0,
      group.findIndex((t) => t.id === talk.id)
    )
  }

  withRotation(rotation: number): TalkView {
    return new TalkView(
      this.selectedTalk,
      this.allTalks,
      this.allTracks,
      this.speakers,
      rotation
    )
  }

  // 同じTrackの全Talk
  talksInSameTrack(): Talk[] {
    return this.talksInTrack(this.selectedTalk.trackId)
  }

  // 同じTrackの残りのTalk
  talksLeftInSameTrack(): Talk[] {
    return this.talksLeftInTrack(this.selectedTalk.trackId)
  }

  // 次のSlotの全TrackのTalk
  talksInNextSlot(): Record<string, Talk> {
    // NOTE: 午前中にこのmethodを使うと、キーノートをしているTrack以外は全て午後イチのTalkが出力される
    let startTime: Dayjs = dayjs.tz('2099-10-09T10:00:00+09:00')
    const nextTalks = this.allTracks.reduce(
      (talks, track) => {
        const nextTalks = this.talksLeftInTrack(track.id)
        if (nextTalks.length > 0) {
          talks[track.name] = nextTalks[0]
          startTime =
            startTime > getTime(nextTalks[0].startTime)
              ? getTime(nextTalks[0].startTime)
              : startTime
        }
        return talks
      },
      {} as Record<string, Talk>
    )
    for (const track in nextTalks) {
      if (getTime(nextTalks[track].startTime).isAfter(startTime)) {
        delete nextTalks[track]
      }
    }
    return nextTalks
  }

  speakersOf(talkId: number): Speaker[] {
    const talk = this.allTalksOnTimeTable().find((t) => t.id === talkId)!
    return this.speakers.filter((speaker) =>
      talk.speakers.map((s) => s.id).includes(speaker.id)
    )
  }
}

type TimeSlot = {
  startTime: string
  endTime: string
}

export class MenuView {
  readonly allTalks: Talk[]
  readonly allTracks: Track[]
  readonly speakers: Speaker[]

  constructor(talks: Talk[], tracks: Track[], speakers: Speaker[]) {
    this.allTalks = Array.from(talks).sort((a, b) => a.id - b.id)
    this.allTracks = Array.from(tracks).sort((a, b) => a.id - b.id)
    this.speakers = Array.from(speakers).sort((a, b) => a.id - b.id)
  }

  static withoutDk(
    dayId: string,
    talks: Talk[],
    tracks: Track[],
    speakers: Speaker[]
  ): MenuView {
    return new MenuView(
      talks
        .filter(
          (t) => t.conferenceDayId && t.conferenceDayId.toString() === dayId
        )
        .map((t) => ({ ...t, showOnTimetable: true })),
      tracks,
      speakers
    )
  }

  private allTalksOnTimeTable(): Talk[] {
    return this.allTalks.filter(
      (talk) => talk.showOnTimetable && !config.excludedTalks.includes(talk.id)
    )
  }

  timeSlots(): TimeSlot[] {
    const timeSlots: Record<number, TimeSlot> = {}
    this.allTalksOnTimeTable().forEach((talk) => {
      const ts = getTime(talk.startTime).unix()
      timeSlots[ts] = {
        startTime: talk.startTime,
        endTime: talk.endTime,
      }
    })
    return Object.values(timeSlots).sort((a, b) =>
      getTime(a.startTime).diff(getTime(b.startTime))
    )
  }

  getTalksOnTimeSlot(timeSlot: TimeSlot): Optional<Talk>[] {
    const trackMap = this.allTracks.reduce(
      (map, track, idx) => {
        map[track.id] = idx
        return map
      },
      {} as Record<number, number>
    )

    // set talks length to track length and fill with null
    const talks: Optional<Talk>[] = Array.from(
      { length: this.allTracks.length },
      () => null
    )

    const slotStartUnix = getTime(timeSlot.startTime).unix()

    this.allTalksOnTimeTable()
      .filter((talk) => {
        // 開始時間のみで比較（終了時間が異なるトークも表示）
        return getTime(talk.startTime).unix() === slotStartUnix
      })
      .forEach((talk) => {
        talks[trackMap[talk.trackId]] = talk
      })

    return talks
  }
}
