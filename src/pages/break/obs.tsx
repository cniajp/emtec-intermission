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
import { useEffect, useRef } from 'react'
import config from '@/config'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
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
    const all = isAllTracks(trackId)
    if (
      done.current ||
      !eventAbbr ||
      !confDay ||
      !trackId ||
      (!all && !trackName)
    ) {
      return
    }
    done.current = true

    const dayTalks: Talk[] = talks.filter(
      (talk) => talk.conferenceDayId === Number(confDay)
    )
    // trackId=all のときは、その日にトークがある全トラックを ZIP にまとめる
    const targets = all
      ? tracksWithTalks(tracks, dayTalks)
      : [{ id: Number(trackId), name: String(trackName) }]

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
            url_path: `/break/talks/${talk.id}`,
          })
        )

        return buildObsSceneFile({
          eventAbbr,
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
        downloadExportFiles(files, obsSceneZipName(eventAbbr, String(confDay)))
      )
      .catch((error) => {
        console.error('Error generating OBS config:', error)
      })

    // menuページにリダイレクト
    router.push(`/break/menu/${confDay}`)
  }, [eventAbbr, confDay, trackId, trackName, router])

  return (
    <div className="text-white text-center w-full my-5">
      Generating JSON for{' '}
      {isAllTracks(trackId) ? 'all tracks' : `Track ${trackName}`}...
      Redirecting to menu...
    </div>
  )
}
