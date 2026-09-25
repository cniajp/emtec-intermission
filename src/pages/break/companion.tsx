import {
  buildCompanionConfig,
  companionOptionsFromQuery,
  downloadCompanionConfig,
} from '@/components/tools/CompanionConfigGenerate'
import { sceneTimesOf } from '@/components/tools/obsSceneNames'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import config from '@/config'
import { talks } from '@/data/talks'

/**
 * 開くと Companion 設定をダウンロードしてメニューに戻る。
 * メニューの Companion モーダルの「URL をコピー」で作る URL の行き先
 */
export default function CompanionPage() {
  const router = useRouter()
  // router は遷移中にも更新されるので、二重ダウンロードしないよう1回に限る
  const done = useRef(false)

  useEffect(() => {
    if (done.current || !router.isReady) return
    const { confDay, trackId, trackName } = router.query
    if (!confDay || !trackId) return
    done.current = true

    const trackTalks = talks.filter(
      (talk) =>
        talk.conferenceDayId === Number(confDay) &&
        talk.trackId === Number(trackId)
    )
    downloadCompanionConfig(
      buildCompanionConfig({
        ...companionOptionsFromQuery(router.query),
        times: sceneTimesOf(trackTalks),
      }),
      {
        eventAbbr: config.eventAbbr,
        confDay: String(confDay),
        trackName: String(trackName ?? trackId),
      }
    )

    router.push(`/break/menu/${confDay}`)
  }, [router])

  return (
    <div className="text-white text-center w-full my-5">
      Generating Companion config for Track {router.query.trackName}...
      Redirecting to menu...
    </div>
  )
}
