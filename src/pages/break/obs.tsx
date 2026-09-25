import ObsSceneGenerate, {
  parseVolumeDb,
} from '@/components/tools/ObsSceneGenerate'
import { sceneTimeOf } from '@/components/tools/obsSceneNames'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import config from '@/config'
import { talks } from '@/data/talks'
import { Talk } from '@/data/types'

export default function ObsPage() {
  const router = useRouter()
  // router は遷移中にも更新されるので、二重ダウンロードしないよう1回に限る
  const done = useRef(false)
  const {
    confDay,
    trackId,
    trackName,
    includeAttack,
    includeBackground,
    includeCountdown,
    includeSimul,
    simulType,
    simulUrl,
    simulVolumeDb,
    os,
    username,
    talkVolumeDb,
    countdownVolumeDb,
  } = router.query
  const { eventAbbr } = config

  useEffect(() => {
    if (done.current || !eventAbbr || !confDay || !trackId || !trackName) {
      return
    }
    done.current = true

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
      (talk) => ({
        name: sceneTimeOf(talk.startTime),
        url_path: `/break/talks/${talk.id}`,
      })
    )

    // obsSceneGenerate.tsxを実行
    ObsSceneGenerate({
      eventAbbr,
      confDay,
      trackName,
      template,
      includeAttack: includeAttack === 'true',
      includeBackground: includeBackground === 'true',
      includeCountdown: includeCountdown === 'true',
      includeSimul: includeSimul === 'true',
      simulType: simulType === 'browser' ? 'browser' : 'vlc',
      simulUrl: (simulUrl as string) || undefined,
      os: (os as 'windows' | 'mac') || 'windows',
      username: (username as string) || 'emtec',
      talkVolumeDb: parseVolumeDb(talkVolumeDb),
      countdownVolumeDb: parseVolumeDb(countdownVolumeDb),
      simulVolumeDb: parseVolumeDb(simulVolumeDb),
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
