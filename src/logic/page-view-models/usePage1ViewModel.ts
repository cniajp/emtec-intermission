import config from '@/config'
import { useBrand } from '@/brand/BrandProvider'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'

// Page1 は遷移タイマー以外にロジックを持たない (view はそのまま渡す)
export function usePage1ViewModel() {
  const brand = useBrand()
  useTimedPageTransition('Page1', config.transTimePage1 ?? brand.page1.seconds)
}
