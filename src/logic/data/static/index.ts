import { useMemo } from 'react'
import { MenuView, TalkView } from '@/logic/models/talkView'
import { speakers } from '@/data/speakers'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { staticConfig } from '@/staticConfig'
import type { DataSource, MenuViewResult, TalkViewResult } from '../types'
import type { Optional } from '@/utils/types'

function useTalkView(talkId: Optional<string>): TalkViewResult {
  const view = useMemo(() => {
    if (!talkId) return null
    return TalkView.withoutDk(talkId, talks, tracks, speakers)
  }, [talkId])
  return { view, isLoading: false }
}

function useMenuView(dayNum: Optional<string>): MenuViewResult {
  const view = useMemo(() => {
    if (!dayNum) return null
    return MenuView.withoutDk(dayNum, talks, tracks, speakers)
  }, [dayNum])
  return { view, isLoading: false }
}

const videoCacheUrls = staticConfig.break.page4.playlist.flatMap((item) =>
  item.sources.map((s) => s.src)
)

export const staticDataSource: DataSource = {
  name: 'static',
  useTalkView,
  useMenuView,
  videoCacheUrls,
}
