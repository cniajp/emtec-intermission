import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import { usePage1ViewModel } from '@/logic/page-view-models/usePage1ViewModel'
import { useTheme } from '@/themes/ThemeProvider'

type Props = { view: Optional<TalkView> }

export default function Page1({ view }: Props) {
  const { Page1: Presenter } = useTheme()
  const vm = usePage1ViewModel(view)
  return <Presenter view={vm.view} />
}
