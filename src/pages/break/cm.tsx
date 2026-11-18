import CmOnlyPage from '@/components/media/CmOnlyPage'
import { tracks } from '@/data/tracks'

// 静的データ版: 告知スライド（Page3）と CM（Page4）だけを流すページ。
// ?trackName= が src/data/tracks.ts のトラックと一致すれば、そのハッシュタグを使う
export default function CmPage() {
  return <CmOnlyPage brandName="static" tracks={tracks} />
}
