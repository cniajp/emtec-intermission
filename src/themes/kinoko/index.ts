import type { Theme } from '../types'
import styles from './theme.module.css'
import Page1 from './page1'
import Page2 from './page2'
import Page3 from './page3'
import Page4 from './page4'

export const defaultTheme: Theme = {
  name: 'kinoko',
  classes: {
    loadingContainer: styles.loadingContainer,
    loadingLogoContainer: styles.loadingLogoContainer,
    loadingLogo: styles.loadingLogo,
    loadingLogoFadeOut: styles.loadingLogoFadeOut,
    contentFadeIn: styles.contentFadeIn,
    spinSlowCw: styles.spinSlowCw,
    spinSlowCcw: styles.spinSlowCcw,
    logoShape: {
      circle: styles.logoCircle,
      none: '',
    },
  },
  Page1,
  Page2,
  Page3,
  Page4,
}

export { AvatarPreLoader, Page3ImagePreLoader } from './page2'
