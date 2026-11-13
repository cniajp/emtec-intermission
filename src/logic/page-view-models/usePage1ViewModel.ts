import config from '@/config'
import { useBrand } from '@/brand/BrandProvider'
import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'
import { useSameStartRotation } from './useSameStartRotation'

// Page1 は遷移タイマーと、同時刻セッションの切り替えだけを持つ
export function usePage1ViewModel(view: Optional<TalkView> = null) {
  const brand = useBrand()
  const seconds = config.transTimePage1 ?? brand.page1.seconds
  useTimedPageTransition('Page1', seconds)
  const trackIds = view ? [view.selectedTalk.trackId] : []
  return { view: useSameStartRotation(view, seconds, trackIds) }
}
