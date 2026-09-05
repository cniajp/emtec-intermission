import type { Brand } from '@/brand/types'
import type { Playlist } from '@/components/media/playlist'

// テスト用の Brand。overrides で必要な部分だけ差し替える。
export function makeBrand(overrides?: {
  alias?: string
  images?: string[]
  trackImages?: Brand['page3']['trackImages']
  secondsPerImage?: number
  playlist?: Playlist
}): Brand {
  return {
    name: 'static',
    base: {
      loadingIconSrc: '',
      loadingEnabled: false,
      loadingLogoShape: 'none',
      backgroundSrc: '',
      audioSrc: '',
      hashTag: { all: '', break: '' },
      useHashTagAsTrackName: false,
      defaultAvatarSrc: '',
      headerLogoSrc: '',
      headerBackgroundColor: '',
    },
    page1: { seconds: 10 },
    page2: { seconds: 10 },
    page3: {
      alias: overrides?.alias ?? 'test-alias',
      images: overrides?.images ?? [],
      trackImages: overrides?.trackImages ?? {},
      secondsPerImage: overrides?.secondsPerImage ?? 10,
    },
    page4: { playlist: overrides?.playlist ?? [] },
    eventAbbrConfigKey: 'eventAbbr',
    useTrackHashTagProperty: false,
    showAbstractPrefix: false,
    routePrefix: '/break',
  }
}
