import { staticConfig } from '@/staticConfig'
import type { Brand } from './types'

export const dreamkastBrand: Brand = {
  name: 'dreamkast',
  base: staticConfig.breakDk.base,
  page3: staticConfig.breakDk.page3,
  page4: staticConfig.breakDk.page4,
  eventAbbrConfigKey: 'dkEventAbbr',
  useTrackHashTagProperty: false,
  showAbstractPrefix: true,
  routePrefix: '/break-dk',
}
