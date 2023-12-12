import config from '@/config'
import { Speaker, Talk, Track } from '@/generated/dreamkast-api.generated'
import { getTime } from '@/utils/time'
import { Optional } from '@/utils/types'
import dayjs, { Dayjs } from 'dayjs'

export class TalkView {
  readonly selectedTalk: Talk
  readonly selectedTrack: Track
  readonly allTalks: Talk[]
  readonly allTracks: Track[]
  readonly speakers: Speaker[]

  constructor(talk: Talk, talks: Talk[], tracks: Track[], speakers: Speaker[]) {
    this.selectedTalk = talk
    this.allTalks = Array.from(talks).sort((a, b) => a.id - b.id)
    this.allTracks = Array.from(tracks).sort((a, b) => a.id - b.id)
    this.speakers = Array.from(speakers).sort((a, b) => a.id - b.id)
    this.selectedTrack = this.allTracks.find(
      (track) => track.id === talk.trackId
    )!
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

  private talksLeftInTrack(trackId: number): Talk[] {
    const afterFrom = getTime(this.selectedTalk.startTime)
    return this.talksInTrack(trackId).filter(
      (t) => getTime(t.startTime) >= afterFrom
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

    this.allTalksOnTimeTable()
      .filter((talk) => {
        return (
          timeSlot.startTime === talk.startTime &&
          timeSlot.endTime === talk.endTime
        )
      })
      .forEach((talk) => {
        talks[trackMap[talk.trackId]] = talk
      })

    return talks
  }
}
