import {
  buildCompanionConfig,
  companionConfigFile,
  companionOptionsFromQuery,
  companionZipName,
} from '@/components/tools/CompanionConfigGenerate'
import {
  downloadExportFiles,
  isAllTracks,
  tracksWithTalks,
} from '@/components/tools/exportAll'
import { sceneTimesOf } from '@/components/tools/obsSceneNames'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import config from '@/config'
import {
  useGetEvent,
  useGetTalks,
  useGetTracks,
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
  // trackId=all のときは、その日にトークがある全トラックを ZIP にまとめる
  const all = isAllTracks(trackId)
  const trackResult = useGetTracks()

  useEffect(() => {
    if (done.current || !router.isReady) return
    if (!confDay || !trackId) return
    // URL を直接開いたときは API の取得を待つ
    if (eventResult.isLoading || talkResult.isLoading) return
    if (all && trackResult.isLoading) return
    done.current = true

    if (!apiConfDayId || !talkResult.data) {
      alert('Conference day or talks not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    if (all && !trackResult.data) {
      alert('Track data not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    const dayTalks = talkResult.data
    const targets = all
      ? tracksWithTalks(trackResult.data ?? [], dayTalks)
      : [{ id: Number(trackId), name: String(trackName ?? trackId) }]
    const options = companionOptionsFromQuery(router.query)
    downloadExportFiles(
      targets.map((track) =>
        companionConfigFile(
          buildCompanionConfig({
            ...options,
            times: sceneTimesOf(
              dayTalks.filter((talk) => talk.trackId === track.id)
            ),
          }),
          {
            eventAbbr: config.dkEventAbbr,
            confDay: String(confDay),
            trackName: track.name,
          }
        )
      ),
      companionZipName(config.dkEventAbbr, String(confDay), options.device)
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
    all,
    trackResult.isLoading,
    trackResult.data,
    trackName,
  ])

  return (
    <div className="text-white text-center w-full my-5">
      Generating Companion config for{' '}
      {all ? 'all tracks' : `Track ${router.query.trackName}`}... Redirecting to
      menu...
    </div>
  )
}
