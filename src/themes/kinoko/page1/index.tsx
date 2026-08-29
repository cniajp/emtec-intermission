import type { Page1PresenterProps } from '@/themes/types'
import PageHeader from '../PageHeader'
import { Main } from './Main'
import { Side } from './Side'

export default function Page1Presenter({ view }: Page1PresenterProps) {
  return (
    <div>
      <PageHeader view={view} />
      <div className="h-full">
        <div className="flex flex-row h-full">
          <div className="basis-3/5">
            <Main view={view} />
          </div>
          <div className="basis-2/5">
            <Side view={view} />
          </div>
        </div>
      </div>
    </div>
  )
}
