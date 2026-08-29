import type { Optional } from '@/utils/types'
import type { TalkView } from '@/logic/models/talkView'
import { usePage3ViewModel } from '@/logic/page-view-models/usePage3ViewModel'
import { useTheme } from '@/themes/ThemeProvider'

type Props = { view: Optional<TalkView> }

export default function Page3({ view }: Props) {
  const { Page3: Presenter } = useTheme()
  const vm = usePage3ViewModel(view)
  return <Presenter view={view} {...vm} />
}
