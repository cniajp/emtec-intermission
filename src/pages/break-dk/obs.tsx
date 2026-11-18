import {
  buildObsSceneFile,
  obsSceneZipName,
  parseVolumeDb,
} from '@/components/tools/ObsSceneGenerate'
import {
  downloadExportFiles,
  isAllTracks,
  tracksWithTalks,
} from '@/components/tools/exportAll'
import { sceneTimeOf } from '@/components/tools/obsSceneNames'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import config from '@/config'
import { Talk } from '@/data/types'
import {
  useGetTalks,
  useGetEvent,
  useGetTracks,
} from '@/logic/data/dreamkast/useGetTalksAndTracks'

export default function ObsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
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
    os,
    username,
    talkVolumeDb,
    countdownVolumeDb,
    simulVolumeDb,
  } = router.query
  const { dkEventAbbr } = config
  // trackId=all のときは、その日にトークがある全トラックを ZIP にまとめる
  const all = isAllTracks(trackId)

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
    if (!isClient || !router.isReady || done.current) return
    // URL を直接開いたときは API の取得を待つ (キャッシュが無いので最初は未取得)
    if (
      eventResult.isLoading ||
      trackResult.isLoading ||
      talkResult.isLoading
    ) {
      return
    }
    done.current = true

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

    if (!all && !apiTrackId) {
      alert('Track not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    if (!talkResult.data) {
      alert('Talk data not found')
      router.push(`/break-dk/menu/${confDay}`)
      return
    }

    if (!dkEventAbbr || !confDay || !apiConfDayId || !talkResult.data) {
      return
    }

    const dayTalks: Talk[] = talkResult.data.filter(
      (talk) => talk.conferenceDayId === apiConfDayId
    )
    const targets = all
      ? tracksWithTalks(trackResult.data, dayTalks)
      : [{ id: apiTrackId as number, name: String(trackName) }]

    Promise.all(
      targets.map((track) => {
        // 開始時刻、talk_idを取得する
        const talkList = dayTalks
          .filter((talk) => talk.trackId === track.id)
          .sort((a, b) => {
            if (a.startTime < b.startTime) return -1
            if (a.startTime > b.startTime) return 1
            return 0
          })

        const template: { name: string; url_path: string }[] = talkList.map(
          (talk) => ({
            name: sceneTimeOf(talk.startTime),
            url_path: `/break-dk/talks/${talk.id}`,
          })
        )

        if (nextDayId) {
          // 次の日の最初のトークの時間も追加する
          template.push({
            name: 'NextDayTalk',
            url_path: `/break-dk/talks/2764`, // ハードコーディング
          })
        }

        return buildObsSceneFile({
          eventAbbr: dkEventAbbr,
          confDay,
          trackName: track.name,
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
      })
    )
      .then((files) =>
        downloadExportFiles(
          files,
          obsSceneZipName(dkEventAbbr, String(confDay))
        )
      )
      .catch((error) => {
        console.error('Error generating OBS config:', error)
      })

    // menuページにリダイレクト
    router.push(`/break-dk/menu/${confDay}`)
  }, [
    isClient,
    eventResult.isLoading,
    trackResult.isLoading,
    talkResult.isLoading,
    eventResult.data,
    trackResult.data,
    talkResult.data,
    dkEventAbbr,
    confDay,
    apiConfDayId,
    apiTrackId,
    all,
    trackName,
    router,
    nextDayId,
  ])

  if (!isClient) {
    return <div className="text-white text-center w-full my-5">Loading...</div>
  }

  return (
    <div className="text-white text-center w-full my-5">
      Generating JSON for {all ? 'all tracks' : `Track ${trackName}`}...
      Redirecting to menu...
    </div>
  )
}
