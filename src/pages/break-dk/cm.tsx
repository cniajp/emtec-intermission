import CmOnlyPage from '@/components/media/CmOnlyPage'

// Dreamkast版: 告知スライド（Page3）と CM（Page4）だけを流すページ。
// Dreamkast API は呼ばない（トラック名は ?trackName= で渡す）
export default function CmPage() {
  return <CmOnlyPage brandName="dreamkast" />
}
