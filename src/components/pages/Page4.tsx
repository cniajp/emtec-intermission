import { usePage4ViewModel } from '@/logic/page-view-models/usePage4ViewModel'
import { useTheme } from '@/themes/ThemeProvider'

export default function Page4() {
  const { Page4: Presenter } = useTheme()
  const vm = usePage4ViewModel()
  return <Presenter {...vm} />
}
