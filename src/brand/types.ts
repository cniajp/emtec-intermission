import type { Playlist } from '@/components/media/playlist'
import type { TrackImageInserts } from '@/staticConfig'
import type { LoadingLogoShape } from '@/themes/types'

export type BrandName = 'static' | 'dreamkast'

// イベント固有のアセット・文言・追加レイヤーをまとめる。
// 「Dreamkast かどうか」を Page から消し、代わりに `useBrand()` で必要物だけを取る。
export interface Brand {
  name: BrandName
  base: {
    loadingIconSrc: string
    loadingEnabled: boolean
    loadingLogoShape: LoadingLogoShape
    backgroundSrc: string
    audioSrc: string
    hashTag: { all: string; break: string }
    useHashTagAsTrackName: boolean
    defaultAvatarSrc: string
    // Page ヘッダに使うロゴ画像
    headerLogoSrc: string
    // Page ヘッダの帯背景色 (Tailwind 経由できないので raw で持つ)
    headerBackgroundColor: string
  }
  page1: {
    // 表示秒数（config.transTimePage1 で一時上書き可能）
    seconds: number
  }
  page2: {
    seconds: number
  }
  page3: {
    alias: string
    images: ReadonlyArray<string>
    trackImages: TrackImageInserts
    // 1枚あたりの表示秒数。Page3 の合計時間 = 枚数 × この値
    // （config.transTimePage3 で一時上書き可能）
    secondsPerImage: number
  }
  page4: {
    playlist: Playlist
  }
  // eventAbbr は brand と 1:1 対応 (config.eventAbbr / config.dkEventAbbr のどちらを使うか)
  eventAbbrConfigKey: 'eventAbbr' | 'dkEventAbbr'
  // トークの hashTag プロパティを使うか（現状 isDk=false のみ true）
  useTrackHashTagProperty: boolean
  // Page1 の abstract に "Abstract: " プレフィックスを付けるか (現状 isDk=true のみ)
  showAbstractPrefix: boolean
  // menu → talks 遷移時のプレフィックス（`/break` または `/break-dk`）
  routePrefix: '/break' | '/break-dk'
}
