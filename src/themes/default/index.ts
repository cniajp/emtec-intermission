import type { Theme } from '../types'
import Page1 from './page1'
import Page2 from './page2'
import Page3 from './page3'
import Page4 from './page4'

export const defaultTheme: Theme = {
  name: 'default',
  Page1,
  Page2,
  Page3,
  Page4,
}

export { AvatarPreLoader, Page3ImagePreLoader } from './page2'
