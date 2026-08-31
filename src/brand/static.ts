import { staticConfig } from '@/staticConfig'
import type { Brand } from './types'

export const staticBrand: Brand = {
  name: 'static',
  base: staticConfig.break.base,
  page3: staticConfig.break.page3,
  page4: staticConfig.break.page4,
  eventAbbrConfigKey: 'eventAbbr',
  useTrackHashTagProperty: true,
  showAbstractPrefix: false,
  routePrefix: '/break',
}
