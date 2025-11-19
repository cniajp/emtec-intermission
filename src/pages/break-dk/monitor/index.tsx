import {
  Track,
  Talk,
  useGetApiV1TracksQuery,
  useGetApiV1TalksQuery,
} from '@/generated/dreamkast-api.generated'
import config from '@/config'
import { nowAccurate, startTimeSync } from '@/utils/time'
import { useEffect, useMemo, useRef, useState } from 'react'

// onAirTalkはtalk_idまたはidのみを含む可能性がある
type OnAirTalk = {
  id?: number
  talk_id?: number
  [key: string]: unknown
}

export default function MonitorPage() {
  // 5秒間隔でポーリングして最新のOnAir情報を取得
  const {
    data: tracks,
    isLoading: tracksLoading,
    isFetching: tracksFetching,
    isSuccess: tracksSuccess,
  } = useGetApiV1TracksQuery(
    { eventAbbr: config.dkEventAbbr },
    { pollingInterval: 5000 }
  )

  // トーク情報を取得（conferenceDayIdsを指定せずにすべてのトークを取得）
  const {
    data: talks,
    isLoading: talksLoading,
    isFetching: talksFetching,
    isSuccess: talksSuccess,
  } = useGetApiV1TalksQuery({ eventAbbr: config.dkEventAbbr })

  const isLoading = tracksLoading || talksLoading
  const isFetching = tracksFetching || talksFetching
  const isSuccess = tracksSuccess && talksSuccess

  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)
  const prevIsFetchingRef = useRef<boolean>(false)
  const isInitialLoadRef = useRef<boolean>(true)

  // talk_idまたはidからTalk情報を取得するヘルパー関数
  const getTalkById = useMemo(() => {
    if (!talks) return null
    return (talkId: number | undefined): Talk | undefined => {
      if (talkId === undefined) return undefined
      return talks.find((talk) => talk.id === talkId)
    }
  }, [talks])

  // 現在時刻をサーバー時刻基準で1秒ごとに更新
  useEffect(() => {
    startTimeSync()

    const updateTime = () => {
      setCurrentTime(nowAccurate().toDate())
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  // フェッチが完了したときに最終更新時刻を記録
  useEffect(() => {
    // フェッチが完了したとき（isFetchingがtrueからfalseになったとき）に更新時刻を記録
    if (!isFetching && isSuccess && tracks) {
      // 前回がフェッチ中だった場合、または初回ロード完了時
      if (prevIsFetchingRef.current || isInitialLoadRef.current) {
        setLastUpdateTime(nowAccurate().toDate())
        isInitialLoadRef.current = false
      }
    }
    prevIsFetchingRef.current = isFetching
  }, [isFetching, isSuccess, tracks])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOnAirStatus = (track: Track) => {
    const onAirTalk = track.onAirTalk as OnAirTalk | null | undefined
    if (!onAirTalk) {
      return { isOnAir: false, talk: null, talkInfo: null }
    }
    const talkId = onAirTalk.talk_id ?? onAirTalk.id
    const talkInfo = getTalkById ? getTalkById(talkId) : undefined
    return { isOnAir: true, talk: onAirTalk, talkInfo }
  }

  if (isLoading) {
    return (
      <div className="w-[1920px] h-[1080px] bg-transparent text-white flex items-center justify-center">
        <div className="text-center text-xl">読み込み中...</div>
      </div>
    )
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="w-[1920px] h-[1080px] bg-transparent text-white flex items-center justify-center">
        <div className="text-center text-xl">
          トラック情報が取得できませんでした
        </div>
      </div>
    )
  }

  // トラックを最大4つまで取得（4分割表示用）
  const displayTracks = tracks.slice(0, 4)

  // 各セクションの位置を定義（左上、右上、左下、右下）
  const sectionPositions = [
    { top: 0, left: 0 }, // 左上
    { top: 0, left: 960 }, // 右上
    { top: 540, left: 0 }, // 左下
    { top: 540, left: 960 }, // 右下
  ]

  return (
    <div className="w-[1920px] h-[1080px] bg-transparent text-white relative overflow-hidden">
      {displayTracks.map((track, index) => {
        const { isOnAir, talk, talkInfo } = getOnAirStatus(track)
        const position = sectionPositions[index]

        return (
          <div
            key={track.id}
            className="absolute"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: '960px',
              height: '540px',
            }}
          >
            <div
              className={`p-6 h-full flex flex-col ${
                index >= 2 ? 'justify-end' : ''
              } bg-black/40 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Track {track.name}</h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isOnAir
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {isOnAir ? 'ON AIR' : 'OFF AIR'}
                </div>
              </div>

              {isOnAir && talk ? (
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-400">トークID</div>
                    <div className="text-lg font-semibold">
                      {talk.talk_id ?? talk.id ?? '-'}
                    </div>
                  </div>
                  {talkInfo ? (
                    <>
                      <div>
                        <div className="text-sm text-gray-400">タイトル</div>
                        <div className="text-lg font-semibold">
                          {talkInfo.title || '-'}
                        </div>
                      </div>
                      {talkInfo.speakers && talkInfo.speakers.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400">
                            スピーカー
                          </div>
                          <div className="text-lg">
                            {talkInfo.speakers
                              .map((s) => s.name || `ID: ${s.id}`)
                              .join(', ')}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-base text-gray-400">
                            開始時刻
                          </div>
                          <div className="text-2xl font-semibold">
                            {formatDateTime(talkInfo.startTime)}
                          </div>
                        </div>
                        <div>
                          <div className="text-base text-gray-400">
                            終了時刻
                          </div>
                          <div className="text-2xl font-semibold">
                            {formatDateTime(talkInfo.endTime)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-yellow-400 text-sm">
                      トーク情報を取得中...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  現在、OnAir中のトークはありません
                </div>
              )}

              {track.videoPlatform && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-sm text-gray-400">
                    動画プラットフォーム
                  </div>
                  <div className="text-sm">{track.videoPlatform}</div>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* 現在時刻と更新時間を画面中央に表示 */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black/40 rounded-2xl px-8 py-6 backdrop-blur-sm"
        style={{ zIndex: 10 }}
      >
        <div className="text-2xl font-bold mb-2">
          現在時刻: {formatTime(currentTime)}
        </div>
        <div className="text-lg text-gray-400">
          最終更新: {lastUpdateTime ? formatTime(lastUpdateTime) : '取得中...'}{' '}
          (自動更新: 5秒間隔)
        </div>
      </div>
    </div>
  )
}
