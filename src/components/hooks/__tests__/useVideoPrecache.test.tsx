import { act, renderHook } from '@testing-library/react'
import {
  useVideoPrecache,
  VIDEO_PRECACHE_DELAY_MS,
} from '@/components/hooks/useVideoPrecache'

const URLS = ['https://example.com/a.mp4', 'https://example.com/b.mp4']

function mockServiceWorker() {
  const postMessage = jest.fn()
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { ready: Promise.resolve({ active: { postMessage } }) },
  })
  return postMessage
}

// タイマーを進めたあと、ready の then が走るのを待つ
async function advance(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms)
    await Promise.resolve()
  })
}

describe('useVideoPrecache', () => {
  afterEach(() => {
    delete (navigator as { serviceWorker?: unknown }).serviceWorker
  })

  it('一定時間後に、未キャッシュ分だけ取得する依頼を Service Worker に送る', async () => {
    jest.useFakeTimers()
    const postMessage = mockServiceWorker()
    renderHook(() => useVideoPrecache(URLS))

    await advance(VIDEO_PRECACHE_DELAY_MS - 1)
    expect(postMessage).not.toHaveBeenCalled()

    await advance(1)
    expect(postMessage).toHaveBeenCalledTimes(1)
    expect(postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_CACHE',
      urls: URLS,
      onlyMissing: true,
    })
  })

  it('再レンダーで配列の参照が変わっても、中身が同じなら送り直さない', async () => {
    jest.useFakeTimers()
    const postMessage = mockServiceWorker()
    const { rerender } = renderHook(() => useVideoPrecache([...URLS]))

    await advance(VIDEO_PRECACHE_DELAY_MS)
    rerender()
    await advance(VIDEO_PRECACHE_DELAY_MS)

    expect(postMessage).toHaveBeenCalledTimes(1)
  })

  it('動画が無ければ何も送らない', async () => {
    jest.useFakeTimers()
    const postMessage = mockServiceWorker()
    renderHook(() => useVideoPrecache([]))

    await advance(VIDEO_PRECACHE_DELAY_MS)
    expect(postMessage).not.toHaveBeenCalled()
  })

  it('送る前に unmount されたら送らない', async () => {
    jest.useFakeTimers()
    const postMessage = mockServiceWorker()
    const { unmount } = renderHook(() => useVideoPrecache(URLS))

    unmount()
    await advance(VIDEO_PRECACHE_DELAY_MS)
    expect(postMessage).not.toHaveBeenCalled()
  })

  it('Service Worker 未対応の環境では何もしない', async () => {
    jest.useFakeTimers()
    expect('serviceWorker' in navigator).toBe(false)
    expect(() => renderHook(() => useVideoPrecache(URLS))).not.toThrow()
    await advance(VIDEO_PRECACHE_DELAY_MS)
  })
})
