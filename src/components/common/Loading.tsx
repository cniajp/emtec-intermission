import Image from 'next/image'
import { useTheme } from '@/themes/ThemeProvider'
import type { LoadingLogoShape } from '@/themes/types'

type LoadingProps = {
  logoPath?: string
  isFadingOut?: boolean
  logoShape?: LoadingLogoShape
}

export default function Loading({
  logoPath = '/intermission.png',
  isFadingOut = false,
  logoShape = 'none',
}: LoadingProps) {
  const { classes } = useTheme()
  return (
    <div className={`h-full w-full ${classes.loadingContainer}`}>
      <div className={classes.loadingLogoContainer}>
        <Image
          src={logoPath}
          alt="Logo"
          width={400}
          height={100}
          className={`${classes.loadingLogo} ${isFadingOut ? classes.loadingLogoFadeOut : ''} ${classes.logoShape[logoShape]}`}
          priority
        />
      </div>
    </div>
  )
}
