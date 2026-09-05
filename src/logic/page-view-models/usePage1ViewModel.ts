import config from '@/config'
import { useBrand } from '@/brand/BrandProvider'
import { usePageDisplayTelemetry } from '@/logic/page-flow/usePageTelemetry'
import { useTimedPageTransition } from '@/logic/page-flow/usePageTransition'

// Page1 は telemetry と遷移タイマー以外にロジックを持たない (view はそのまま渡す)
export function usePage1ViewModel() {
  const brand = useBrand()
  usePageDisplayTelemetry('Page1')
  useTimedPageTransition('Page1', config.transTimePage1 ?? brand.page1.seconds)
}
