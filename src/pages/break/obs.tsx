import ObsSceneGenerate from '@/components/ObsSceneGenerate'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import config from '@/config'
import { talks } from '@/data/talks'
import { Talk } from '@/data/types'

export default function ObsPage() {
  const router = useRouter()
  const { confDay, trackId, trackName, includeAttack, os } = router.query
  const { eventAbbr } = config

  useEffect(() => {
    if (!eventAbbr || !confDay || !trackId || !trackName) {
      return
    }

    // 開始時刻、talk_idを取得する
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

    const template: { name: string; url_path: string }[] = talkList.map(
      (talk) => {
        const startTime = new Date(talk.startTime)
        const hours = startTime.getHours().toString().padStart(2, '0')
        const minutes = startTime.getMinutes().toString().padStart(2, '0')
        const formattedTime = `${hours}:${minutes}`
        return { name: formattedTime, url_path: `/break/talks/${talk.id}` }
      }
    )

    // obsSceneGenerate.tsxを実行
    ObsSceneGenerate({
      eventAbbr,
      confDay,
      trackName,
      template,
      includeAttack: includeAttack === 'true',
      os: (os as 'windows' | 'mac') || 'windows',
    })

    // menuページにリダイレクト
    router.push(`/break/menu/${confDay}`)
  }, [eventAbbr, confDay, trackId, trackName, router])

  return (
    <div className="text-white text-center w-full my-5">
      Generating JSON for Track {trackName}... Redirecting to menu...
    </div>
  )
}
