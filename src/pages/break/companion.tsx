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
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'

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

    const dayTalks = talks.filter(
      (talk) => talk.conferenceDayId === Number(confDay)
    )
    // trackId=all のときは、その日にトークがある全トラックを ZIP にまとめる
    const targets = isAllTracks(trackId)
      ? tracksWithTalks(tracks, dayTalks)
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
            eventAbbr: config.eventAbbr,
            confDay: String(confDay),
            trackName: track.name,
          }
        )
      ),
      companionZipName(config.eventAbbr, String(confDay), options.device)
    )

    router.push(`/break/menu/${confDay}`)
  }, [router])

  return (
    <div className="text-white text-center w-full my-5">
      Generating Companion config for{' '}
      {isAllTracks(router.query.trackId)
        ? 'all tracks'
        : `Track ${router.query.trackName}`}
      ... Redirecting to menu...
    </div>
  )
}
