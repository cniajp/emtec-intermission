import ObsSceneGenerate from '@/components/ObsSceneGenerate'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import config from '@/config'
import { Talk } from '@/data/types'
import {
  useGetTalks,
  useGetEvent,
  useGetTracks,
} from '@/components/hooks/useGetTalksAndTracks'

export default function ObsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { confDay, trackName, includeAttack, os, username } = router.query
  const { dkEventAbbr } = config

  useEffect(() => {
    setIsClient(true)
  }, [])

  const eventResult = useGetEvent(dkEventAbbr)
  const trackResult = useGetTracks()
  const apiConfDayId =
    eventResult.data?.conferenceDays?.[Number(confDay) - 1]?.id
  const apiTrackId =
    trackResult.data?.filter((t) => t.name === trackName)[0]?.id || null
  const talkResult = useGetTalks(apiConfDayId)
  const nextDayId: number | undefined =
    eventResult.data?.conferenceDays?.[Number(confDay)]?.id

  useEffect(() => {
    if (!isClient) return

    if (!eventResult.data) {
      alert('Event data not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }
    if (!apiConfDayId) {
      alert('Conference day not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }
    if (!trackResult.data) {
      alert('Track data not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    if (!apiTrackId) {
      alert('Track not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    if (!talkResult.data) {
      alert('Talk data not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

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

    if (nextDayId) {
      // 次の日の最初のトークの時間も追加する
      template.push({
        name: 'NextDayTalk',
        url_path: `/break-dk/talks/2764`, // ハードコーディング
      })
    }

    // obsSceneGenerate.tsxを実行
    ObsSceneGenerate({
      eventAbbr: dkEventAbbr,
      confDay,
      trackName,
      template,
      includeAttack: includeAttack === 'true',
      os: (os as 'windows' | 'mac') || 'windows',
      username: (username as string) || 'emtec',
    })

    // menuページにリダイレクト
    router.push(`/break-dk/menu/${confDay}`)
  }, [
    isClient,
    eventResult.data,
    trackResult.data,
    talkResult.data,
    dkEventAbbr,
    confDay,
    apiConfDayId,
    apiTrackId,
    trackName,
    router,
    nextDayId,
  ])

  if (!isClient) {
    return <div className="text-white text-center w-full my-5">Loading...</div>
  }

  return (
    <div className="text-white text-center w-full my-5">
      Generating JSON for Track {trackName}... Redirecting to menu...
    </div>
  )
}
