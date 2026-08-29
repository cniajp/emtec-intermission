import type { Optional } from '@/utils/types'
import type { MenuView, TalkView } from '@/logic/models/talkView'

export type DataSourceName = 'static' | 'dreamkast'

// TalkView を返す1トーク単位のフェッチ結果。ローディング状態を含む。
export type TalkViewResult = {
  view: Optional<TalkView>
  isLoading: boolean
}

// MenuView を返す1日分のフェッチ結果。allDays は menu ページの日付ナビゲータ用。
export type MenuViewResult = {
  view: Optional<MenuView>
  isLoading: boolean
  isEventLoading?: boolean
  allDays?: number[]
}

// DataSource は「TalkView / MenuView を返す」以外を Page 側に一切見せない。
// これにより新 API 追加時は本ファイル配下に実装を1つ足すだけで済む。
export interface DataSource {
  name: DataSourceName
  useTalkView: (talkId: Optional<string>) => TalkViewResult
  useMenuView: (dayNum: Optional<string>) => MenuViewResult
  // 動画キャッシュ更新のための URL リストなど、DataSource 固有の付帯情報も
  // ここに露出させておくと route 側での分岐を消せる。
  videoCacheUrls: string[]
}
