import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { useContext, useEffect, useRef } from 'react'
import { PageCtx } from '../models/pageContext'
import VideoPlaylist from '../media/VideoPlaylist'
import { staticConfig } from '@/staticConfig'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'

type Props = { view: Optional<TalkView>; isDk: boolean }

export default function Page({ isDk }: Props) {
  const { goNextPage } = useContext(PageCtx)
  const { playlist } = isDk
    ? staticConfig.breakDk.page4
    : staticConfig.break.page4
  const renderStartTime = useRef(performance.now())

  useEffect(() => {
    const duration = performance.now() - renderStartTime.current
    pushPageMeasurement('Page4', duration)
    pushPageEvent('Page4', 'page_displayed')
  }, [])

  const handleEnded = () => {
    pushPageEvent('Page4', 'page_exit')
    goNextPage()
  }

  return (
    <div className="w-full h-full">
      <VideoPlaylist onEnded={handleEnded} playlist={playlist}></VideoPlaylist>
    </div>
  )
}
