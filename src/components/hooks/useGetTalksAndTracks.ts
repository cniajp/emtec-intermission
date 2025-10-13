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
import { MenuView, TalkView } from '@/components/models/talkView'

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
  const event = useGetEvent(dkEventAbbr)
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
    console.log(event.data!.conferenceDays!)
    return event.data!.conferenceDays![parseInt(dayNum)].id
  }, [event.data, dayNum])
  const talksResult = useGetTalks(confDayId)
  const tracksResult = useGetTracks()
  const speakersResult = useGetSpeakers()

  const view: Optional<MenuView> = useMemo(() => {
    if (talksResult.data && tracksResult.data && speakersResult.data) {
      return new MenuView(
        talksResult.data,
        tracksResult.data,
        speakersResult.data
      )
    }
    return null
  }, [talksResult.data, tracksResult.data, speakersResult.data])

  return {
    isLoading:
      talksResult.isLoading ||
      tracksResult.isLoading ||
      speakersResult.isLoading,
    view,
  }
}

export const useGetEvent = (confName: Optional<string>) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1EventsByEventAbbrQuery(
    { eventAbbr: confName! },
    { skip: !confName }
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

export const useGetTalks = (conferenceDayId: Optional<number>) => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TalksQuery(
    {
      eventAbbr: config.dkEventAbbr,
      conferenceDayIds: `${conferenceDayId}`,
    },
    { skip: !conferenceDayId }
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

export const useGetTracks = () => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1TracksQuery({
    eventAbbr: config.dkEventAbbr,
  })

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

export const useGetSpeakers = () => {
  const [_, setError] = useState()

  const { data, isLoading, isError, error } = useGetApiV1SpeakersQuery(
    { eventAbbr: config.dkEventAbbr },
    { pollingInterval: 300 * 1000 }
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
