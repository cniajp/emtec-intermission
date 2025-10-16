import ObsSceneGenerate from '@/components/ObsSceneGenerate'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import config from '@/config'
import { Talk } from '@/data/types'
import {
  useGetTalks,
  useGetEvent,
  useGetTracks,
} from '@/components/hooks/useGetTalksAndTracks'

export default function ObsPage() {
  const router = useRouter()
  const { confDay, trackId, trackName } = router.query
  const { dkEventAbbr } = config

  const eventResult = useGetEvent(dkEventAbbr)
  if (!eventResult.data) {
    alert('Event data not found')
    router.push(`/break-dk/menu/${confDay}`)
  }
  const apiConfDayId = eventResult.data?.conferenceDays?.[Number(confDay)]?.id
  if (!apiConfDayId) {
    alert('Conference day not found')
    router.push(`/break-dk/menu/${confDay}`)
  }
  const trackResult = useGetTracks()
  if (!trackResult.data) {
    alert('Track data not found')
    router.push(`/break-dk/menu/${confDay}`)
  }
  const apiTrackId =
    trackResult.data?.filter((t) => t.name === trackName)[0]?.id || null
  if (!apiTrackId) {
    alert('Track not found')
    router.push(`/break-dk/menu/${confDay}`)
  }
  const talkResult = useGetTalks(apiConfDayId)
  if (!talkResult.data) {
    alert('Talk data not found')
    router.push(`/break-dk/menu/${confDay}`)
  }

  useEffect(() => {
    if (
      !dkEventAbbr ||
      !confDay ||
      !apiConfDayId ||
      !apiTrackId ||
      !trackName ||
      !talkResult.data
    ) {
      return
    }

    const talks: Talk[] = talkResult.data

    // 開始時刻、talk_idを取得する
    let talkList: Talk[] = talks.filter(
      (talk) =>
        talk.conferenceDayId === apiConfDayId && talk.trackId === apiTrackId
    )

    talkList = talkList.sort((a, b) => {
      if (a.startTime < b.startTime) return -1
      if (a.startTime > b.startTime) return 1
      return 0
    })

    const template: { name: string; url_path: string }[] = talkList.map(
      (talk) => {
        const startTime = new Date(talk.startTime)
        const hours = startTime.getHours().toString().padStart(2, '0')
        const minutes = startTime.getMinutes().toString().padStart(2, '0')
        const formattedTime = `${hours}:${minutes}`
        return { name: formattedTime, url_path: `/break-dk/talks/${talk.id}` }
      }
    )

    // obsSceneGenerate.tsxを実行
    ObsSceneGenerate({
      eventAbbr: dkEventAbbr,
      confDay,
      trackName,
      template,
    })

    // menuページにリダイレクト
    router.push(`/break-dk/menu/${confDay}`)
  }, [
    dkEventAbbr,
    confDay,
    apiConfDayId,
    apiTrackId,
    trackName,
    router,
    talkResult.data,
  ])

  return (
    <div className="text-white text-center w-full my-5">
      Generating JSON for Track {trackName}... Redirecting to menu...
    </div>
  )
}
