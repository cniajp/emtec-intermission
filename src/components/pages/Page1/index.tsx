import { Optional } from '@/utils/types'
import { TalkView } from '../../models/talkView'
import { useContext, useEffect, useRef } from 'react'
import { PageCtx } from '../../models/pageContext'
import config from '@/config'
import PageHeader from '../PageHeader'
import { pushPageMeasurement, pushPageEvent } from '@/lib/faro'
import { Main } from './Main'
import { Side } from './Side'

type PageProps = { view: Optional<TalkView>; isDk: boolean }

export default function Page({ view, isDk }: PageProps) {
  const { goNextPage } = useContext(PageCtx)
  const renderStartTime = useRef(performance.now())

  useEffect(() => {
    const duration = performance.now() - renderStartTime.current
    pushPageMeasurement('Page1', duration)
    pushPageEvent('Page1', 'page_displayed')

    const cancel = setTimeout(() => {
      pushPageEvent('Page1', 'page_exit')
      goNextPage()
    }, config.transTimePage1 * 1000)
    return () => clearTimeout(cancel)
  }, [goNextPage])

  return (
    <div>
      <PageHeader view={view} isDk={isDk} />
      <div className="h-full">
        <div className="flex flex-row h-full">
          <div className="basis-3/5">
            <Main view={view} isDk={isDk} />
          </div>
          <div className="basis-2/5">
            <Side view={view} isDk={isDk} />
          </div>
        </div>
      </div>
    </div>
  )
}
