import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import { usePage2ViewModel } from '@/logic/page-view-models/usePage2ViewModel'
import { useTheme } from '@/themes/ThemeProvider'

type Props = { view: Optional<TalkView> }

export default function Page2({ view }: Props) {
  const { Page2: Presenter } = useTheme()
  const vm = usePage2ViewModel(view)
  return <Presenter view={view} {...vm} />
}

// route 側でプリロードを配置するため theme から re-export
export { AvatarPreLoader, Page3ImagePreLoader } from '@/themes/default'
