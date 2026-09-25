import {
  buildCompanionConfig,
  companionOptionsFromQuery,
  downloadCompanionConfig,
} from '@/components/tools/CompanionConfigGenerate'
import { sceneTimesOf } from '@/components/tools/obsSceneNames'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import config from '@/config'
import {
  useGetEvent,
  useGetTalks,
} from '@/logic/data/dreamkast/useGetTalksAndTracks'

/**
 * 開くと Companion 設定をダウンロードしてメニューに戻る (Dreamkast 版)。
 * メニューの Companion モーダルの「URL をコピー」で作る URL の行き先
 */
export default function CompanionPage() {
  const router = useRouter()
  // router は遷移中にも更新されるので、二重ダウンロードしないよう1回に限る
  const done = useRef(false)
  const { confDay, trackId, trackName } = router.query

  const eventResult = useGetEvent(config.dkEventAbbr)
  const apiConfDayId =
    eventResult.data?.conferenceDays?.[Number(confDay) - 1]?.id
  const talkResult = useGetTalks(apiConfDayId)

  useEffect(() => {
    if (done.current || !router.isReady) return
    if (!confDay || !trackId) return
    // URL を直接開いたときは API の取得を待つ
    if (eventResult.isLoading || talkResult.isLoading) return
    done.current = true

    if (!apiConfDayId || !talkResult.data) {
      alert('Conference day or talks not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    const trackTalks = talkResult.data.filter(
      (talk) => talk.trackId === Number(trackId)
    )
    downloadCompanionConfig(
      buildCompanionConfig({
        ...companionOptionsFromQuery(router.query),
        times: sceneTimesOf(trackTalks),
      }),
      {
        eventAbbr: config.dkEventAbbr,
        confDay: String(confDay),
        trackName: String(trackName ?? trackId),
      }
    )

    router.push(`/break-dk/menu/${confDay}`)
  }, [
    router,
    confDay,
    trackId,
    apiConfDayId,
    eventResult.isLoading,
    talkResult.isLoading,
    talkResult.data,
    trackName,
  ])

  return (
    <div className="text-white text-center w-full my-5">
      Generating Companion config for Track {router.query.trackName}...
      Redirecting to menu...
    </div>
  )
}
