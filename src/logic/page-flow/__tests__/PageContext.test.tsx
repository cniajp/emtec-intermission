import { act, render, screen } from '@testing-library/react'
import { useContext } from 'react'
import { PageCtx, PageCtxProvider } from '@/logic/page-flow/PageContext'
import { Clock } from '@/components/common/Clock'

jest.mock('@/utils/time', () => ({
  ...jest.requireActual('@/utils/time'),
  startTimeSync: jest.fn(),
}))

describe('PageCtxProvider', () => {
  it('毎秒の時刻更新では PageCtx の利用側を再レンダーしない', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-18T10:00:00+09:00'))
    const renders = jest.fn()
    function Consumer() {
      useContext(PageCtx)
      renders()
      return null
    }

    render(
      <PageCtxProvider>
        <Consumer />
        <span data-testid="clock">
          <Clock />
        </span>
      </PageCtxProvider>
    )
    const initial = renders.mock.calls.length
    expect(screen.getByTestId('clock').textContent).toBe('10:00:00')

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(renders).toHaveBeenCalledTimes(initial)
    expect(screen.getByTestId('clock').textContent).toBe('10:00:05')
  })
})
