import config from '@/config'
import { staticConfig } from '@/staticConfig'
import type { DataSource, MenuViewResult, TalkViewResult } from '../types'
import type { Optional } from '@/utils/types'
import {
  useGetTalksAndTracks,
  useGetTalksAndTracksForMenu,
} from './useGetTalksAndTracks'

function useTalkView(talkId: Optional<string>): TalkViewResult {
  return useGetTalksAndTracks(talkId)
}

function useMenuView(dayNum: Optional<string>): MenuViewResult {
  const { isLoading, isEventLoading, view, allDays } =
    useGetTalksAndTracksForMenu(config.dkEventAbbr, dayNum)
  return { isLoading, isEventLoading, view, allDays }
}

const videoCacheUrls = staticConfig.breakDk.page4.playlist.flatMap((item) =>
  item.sources.map((s) => s.src)
)

export const dreamkastDataSource: DataSource = {
  name: 'dreamkast',
  useTalkView,
  useMenuView,
  videoCacheUrls,
}

// dayId → 1始まり日番号への逆引きは Dreamkast 固有の機能。
// 本来 route 層で `dayId → dayNum` を計算していたロジックをここに集約する。
export { useGetEvent } from './useGetTalksAndTracks'
