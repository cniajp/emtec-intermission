import CompanionConfigGenerate from '@/components/CompanionConfigGenerate'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { talks } from '@/data/talks'
import { Talk } from '@/data/types'

export default function CompanionPage() {
  const router = useRouter()
  const {
    confDay,
    trackId,
    trackName,
    device,
    includeCount,
    includeTrackA,
    includeSlido,
  } = router.query

  useEffect(() => {
    if (!confDay || !trackId || !trackName || !device) {
      return
    }

    // 開始時刻を取得する
    let talkList: Talk[] = talks.filter(
      (talk) =>
        talk.conferenceDayId === Number(confDay) &&
        talk.trackId === Number(trackId)
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
    })

    // menuページにリダイレクト
    router.push(`/break/menu/${confDay}`)
  }, [
    confDay,
    trackId,
    trackName,
    device,
    includeCount,
    includeTrackA,
    includeSlido,
    router,
  ])

  return (
    <div className="text-white text-center w-full my-5">
      Generating Companion config for Track {trackName}... Redirecting to
      menu...
    </div>
  )
}
