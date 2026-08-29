import type { ComponentType } from 'react'
import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import type { Page2ViewModel } from '@/logic/page-view-models/usePage2ViewModel'
import type { Playlist } from '@/components/media/playlist'

// 各 Page presenter が受け取る props。ロジックが計算した viewmodel が
// スプレッドされるので、テーマは JSX とデザイントークンだけに集中できる。

export type Page1PresenterProps = {
  view: Optional<TalkView>
}

export type Page2PresenterProps = {
  view: Optional<TalkView>
} & Page2ViewModel

export type Page3PresenterProps = {
  view: Optional<TalkView>
  isEmpty: boolean
  currentImageSrc: string | null
}

export type Page4PresenterProps = {
  playlist: Playlist
  onEnded: () => void
}

export type ThemeName = 'default'

// brand はロゴの「意味」だけを持ち、CSS クラス名は知らない。
// 実際のクラスへの変換は各テーマの ThemeClasses.logoShape が担う。
export type LoadingLogoShape = 'circle' | 'none'

// テーマ外にあるコンポーネント (Loading, ページシェル) が使うクラス。
// テーマ側の CSS Modules から生成されたスコープ済みクラス名が入る。
export interface ThemeClasses {
  loadingContainer: string
  loadingLogoContainer: string
  loadingLogo: string
  loadingLogoFadeOut: string
  contentFadeIn: string
  spinSlowCw: string
  spinSlowCcw: string
  logoShape: Record<LoadingLogoShape, string>
}

export interface Theme {
  name: ThemeName
  classes: ThemeClasses
  Page1: ComponentType<Page1PresenterProps>
  Page2: ComponentType<Page2PresenterProps>
  Page3: ComponentType<Page3PresenterProps>
  Page4: ComponentType<Page4PresenterProps>
}
