import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import {
  ASSETS_TIMEOUT_MS,
  useAssetsReady,
} from '@/components/hooks/useAssetsReady'

function Stage({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const ready = useAssetsReady(ref, enabled)
  return (
    <div ref={ref}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/a.png" alt="a" />
      <span data-testid="ready">{String(ready)}</span>
    </div>
  )
}

const ready = () => screen.getByTestId('ready').textContent

// jsdom には img.decode が無いので、テストごとに差し込む
function mockDecode(impl: () => Promise<void>) {
  const decode = jest.fn(impl)
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    value: decode,
  })
  return decode
}

describe('useAssetsReady', () => {
  afterEach(() => {
    delete (HTMLImageElement.prototype as { decode?: unknown }).decode
  })

  it('画像のデコードが終わったら true になる', async () => {
    let finish = () => {}
    const decode = mockDecode(
      () => new Promise<void>((resolve) => (finish = resolve))
    )
    render(<Stage enabled />)
    expect(decode).toHaveBeenCalledTimes(1)
    expect(ready()).toBe('false')

    await act(async () => finish())
    expect(ready()).toBe('true')
  })

  it('画像の読み込みに失敗しても true になる', async () => {
    mockDecode(() => Promise.reject(new Error('broken image')))
    await act(async () => {
      render(<Stage enabled />)
    })
    expect(ready()).toBe('true')
  })

  it('終わらなくても上限時間で true になる', () => {
    jest.useFakeTimers()
    mockDecode(() => new Promise<void>(() => {}))
    render(<Stage enabled />)

    act(() => {
      jest.advanceTimersByTime(ASSETS_TIMEOUT_MS - 1)
    })
    expect(ready()).toBe('false')
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(ready()).toBe('true')
  })

  it('enabled が false の間は待ち始めない', () => {
    jest.useFakeTimers()
    const decode = mockDecode(() => Promise.resolve())
    render(<Stage enabled={false} />)

    act(() => {
      jest.advanceTimersByTime(ASSETS_TIMEOUT_MS)
    })
    expect(decode).not.toHaveBeenCalled()
    expect(ready()).toBe('false')
  })
})
