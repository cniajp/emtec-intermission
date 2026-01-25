import CompanionConfigGenerate from '@/components/CompanionConfigGenerate'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import config from '@/config'
import { Talk } from '@/data/types'
import {
  useGetTalks,
  useGetEvent,
  useGetTracks,
} from '@/components/hooks/useGetTalksAndTracks'

export default function CompanionPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const {
    confDay,
    trackName,
    device,
    includeCount,
    includeTrackA,
    includeSlido,
    includeAttack,
  } = router.query
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
      !talkResult.data ||
      !device
    ) {
      return
    }

    const talks: Talk[] = talkResult.data

    // 開始時刻を取得する
    let talkList: Talk[] = talks.filter(
      (talk) =>
        talk.conferenceDayId === apiConfDayId && talk.trackId === apiTrackId
    )

    talkList = talkList.sort((a, b) => {
      if (a.startTime < b.startTime) return -1
      if (a.startTime > b.startTime) return 1
      return 0
    })

    // 時刻リストを生成
    const times: string[] = talkList.map((talk) => {
      const startTime = new Date(talk.startTime)
      const hours = startTime.getHours().toString().padStart(2, '0')
      const minutes = startTime.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    })

    // CompanionConfigGenerateを実行
    CompanionConfigGenerate({
      device: device as 'gostream' | 'vr6hd',
      times,
      specialButtons: {
        count: includeCount === 'true',
        trackA: includeTrackA === 'true',
        slido: includeSlido === 'true',
      },
      includeAttack: includeAttack === 'true',
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
    device,
    includeCount,
    includeTrackA,
    includeSlido,
    includeAttack,
    router,
  ])

  if (!isClient) {
    return <div className="text-white text-center w-full my-5">Loading...</div>
  }

  return (
    <div className="text-white text-center w-full my-5">
      Generating Companion config for Track {trackName}... Redirecting to
      menu...
    </div>
  )
}
