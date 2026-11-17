import config from '@/config'
import {
  useGetApiV1TalksByTalkIdQuery,
  useGetApiV1TalksQuery,
  useGetApiV1TracksQuery,
  useGetApiV1SpeakersQuery,
  useGetApiV1EventsByEventAbbrQuery,
} from '@/generated/dreamkast-api.generated'
import { Optional } from '@/utils/types'
import { useEffect, useMemo, useState } from 'react'
import { MenuView, TalkView } from '@/logic/models/talkView'

export const useGetTalksAndTracks = (talkId: Optional<string>) => {
  const talkResult = useGetTalk(talkId)
  const talksResult = useGetTalks(talkResult.data?.conferenceDayId)
  const tracksResult = useGetTracks()
  const speakersResult = useGetSpeakers()

  const view: Optional<TalkView> = useMemo(() => {
    if (
      talkResult.data &&
      talksResult.data &&
      tracksResult.data &&
      speakersResult.data
    ) {
      return new TalkView(
        talkResult.data,
        talksResult.data,
        tracksResult.data,
        speakersResult.data
      )
    }
    return null
  }, [
    talkResult.data,
    talksResult.data,
    tracksResult.data,
    speakersResult.data,
  ])

  return {
    isLoading:
      talkResult.isLoading ||
      talksResult.isLoading ||
      tracksResult.isLoading ||
      speakersResult.isLoading,
    view,
  }
}

export const useGetTalksAndTracksForMenu = (
  dkEventAbbr: Optional<string>,
  dayNum: Optional<string>
) => {
  // メニューは取得に失敗しても落とさない（前回取得したデータや、再読み込みの案内を出す）
  const options = { throwOnError: false }
  const event = useGetEvent(dkEventAbbr, options)
  const confDayId = useMemo(() => {
    if (!event.data?.conferenceDays) {
      return null
    }
    if (event.data.conferenceDays.length === 0) {
      return null
    }
    if (!dayNum) {
      return null
    }
    const index = parseInt(dayNum) - 1
    if (index < 0 || index >= event.data.conferenceDays.length) {
      return null
    }
    return event.data.conferenceDays[index].id
  }, [event.data, dayNum])
  const talksResult = useGetTalks(confDayId, options)
  const tracksResult = useGetTracks(options)
  // メニューは登壇者の一覧を使わない（登壇者名は talks に入っている）ので、届くのを待たない。
  // 取得自体は続ける: トークのページでは必要なので、ここで取っておくとそのまま使える
  const speakersResult = useGetSpeakers(options)

  const view: Optional<MenuView> = useMemo(() => {
    if (talksResult.data && tracksResult.data) {
      return new MenuView(
        talksResult.data,
        tracksResult.data,
        speakersResult.data ?? []
      )
    }
    return null
  }, [talksResult.data, tracksResult.data, speakersResult.data])

  // 利用可能なDay番号のリスト (1-indexed)
  const allDays = useMemo(() => {
    if (!event.data?.conferenceDays) {
      return []
    }
    return event.data.conferenceDays.map((_, index) => index + 1)
  }, [event.data])

  return {
    isLoading:
      event.isLoading || talksResult.isLoading || tracksResult.isLoading,
    isEventLoading: event.isLoading,
    view,
    allDays,
  }
}

type QueryOptions = {
  // false にすると、取得に失敗しても例外を投げない（data が undefined のまま返る）。
  // 既定は true で、失敗するとページごとエラーになる
  throwOnError?: boolean
}

export const useGetEvent = (
  confName: Optional<string>,
  { throwOnError = true }: QueryOptions = {}
) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr: confName! },
    { skip: !confName }
  )

  useEffect(() => {
    if (isError && throwOnError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error, throwOnError])

  return {
    data,
    isLoading,
  }
}

export const useGetTalk = (talkId: Optional<string>) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TalksByTalkIdQuery(
    { talkId: talkId! },
    { skip: !talkId }
  )

  useEffect(() => {
    if (isError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error])

  return {
    data,
    isLoading,
  }
}

export const useGetTalks = (
  conferenceDayId: Optional<number>,
  { throwOnError = true }: QueryOptions = {}
) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TalksQuery(
    {
      eventAbbr: config.dkEventAbbr,
      conferenceDayIds: `${conferenceDayId}`,
    },
    { skip: !conferenceDayId }
  )

  useEffect(() => {
    if (isError && throwOnError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error, throwOnError])

  return {
    data,
    isLoading,
  }
}

export const useGetTracks = ({ throwOnError = true }: QueryOptions = {}) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TracksQuery({
    eventAbbr: config.dkEventAbbr,
  })

  useEffect(() => {
    if (isError && throwOnError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error, throwOnError])

  return {
    data,
    isLoading,
  }
}

export const useGetSpeakers = ({ throwOnError = true }: QueryOptions = {}) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1SpeakersQuery(
    { eventAbbr: config.dkEventAbbr },
    { pollingInterval: 300 * 1000 }
  )

  useEffect(() => {
    if (isError && throwOnError) {
      setError(() => {
        throw error
      })
    }
  }, [isError, error, throwOnError])

  return {
    data,
    isLoading,
  }
}
