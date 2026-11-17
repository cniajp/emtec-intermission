import {
  VIDEO_CACHE_NAME,
  allVideoUrls,
  clearEverything,
  clearVideoCache,
  formatBytes,
  readCacheStatus,
  requestVideoCache,
} from '@/components/tools/cacheTools'
import { staticConfig } from '@/staticConfig'

// Cache Storage の最小限の代役。名前 → (URL → Content-Length)
function mockCaches(initial: Record<string, Record<string, string | null>>) {
  const store = new Map(
    Object.entries(initial).map(([n, e]) => [n, new Map(Object.entries(e))])
  )
  const api = {
    keys: jest.fn(async () => [...store.keys()]),
    delete: jest.fn(async (name: string) => store.delete(name)),
    open: jest.fn(async (name: string) => {
      if (!store.has(name)) store.set(name, new Map())
      const entries = store.get(name)!
      return {
        keys: async () => [...entries.keys()].map((url) => ({ url })),
        match: async (url: string) =>
          entries.has(url)
            ? {
                headers: {
                  get: (h: string) =>
                    h === 'content-length' ? entries.get(url) : null,
                },
              }
            : undefined,
      }
    }),
  }
  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    value: api,
  })
  return { api, store }
}

function mockServiceWorker(
  registration: object | undefined,
  controlled = true
) {
  const sw = {
    controller: controlled ? {} : null,
    getRegistration: jest.fn(async () => registration),
    getRegistrations: jest.fn(async () => (registration ? [registration] : [])),
  }
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: sw,
  })
  return sw
}

const A = 'https://example.com/a.mp4'
const B = 'https://example.com/b.mp4'
const OLD = 'https://example.com/old.mp4'

afterEach(() => {
  delete (globalThis as { caches?: unknown }).caches
  delete (navigator as { serviceWorker?: unknown }).serviceWorker
})

describe('allVideoUrls', () => {
  it('静的データ版と Dreamkast 版の Page4 の動画を重複なしで返す', () => {
    const urls = allVideoUrls()
    const expected = [
      ...staticConfig.break.page4.playlist,
      ...staticConfig.breakDk.page4.playlist,
    ].flatMap((item) => item.sources.map((s) => s.src))
    expect(urls).toEqual([...new Set(expected)])
    expect(new Set(urls).size).toBe(urls.length)
  })
})

describe('formatBytes', () => {
  it('単位を付けて表示する', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1023)).toBe('1023 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(300 * 1024 * 1024)).toBe('300.0 MB')
    expect(formatBytes(2.5 * 1024 ** 3)).toBe('2.5 GB')
  })
})

describe('readCacheStatus', () => {
  it('動画ごとの保存状況を、プレイリスト順 → プレイリスト外の順で返す', async () => {
    mockCaches({
      [VIDEO_CACHE_NAME]: { [OLD]: null, [B]: '1048576' },
      'serwist-precache-v2': { '/x.png': '10', '/y.png': '20' },
    })
    mockServiceWorker({ waiting: {} }, false)

    const status = await readCacheStatus([A, B])

    expect(status.videos).toEqual([
      { url: A, cached: false, bytes: null, inPlaylist: true },
      { url: B, cached: true, bytes: 1048576, inPlaylist: true },
      { url: OLD, cached: true, bytes: null, inPlaylist: false },
    ])
    expect(status.caches).toEqual([
      { name: VIDEO_CACHE_NAME, count: 2 },
      { name: 'serwist-precache-v2', count: 2 },
    ])
    expect(status.serviceWorker).toEqual({
      registered: true,
      controlled: false,
      waiting: true,
    })
  })

  it('Service Worker が未登録なら registered: false', async () => {
    mockCaches({})
    mockServiceWorker(undefined)
    const status = await readCacheStatus([A])
    expect(status.serviceWorker).toEqual({ registered: false })
    expect(status.videos).toEqual([
      { url: A, cached: false, bytes: null, inPlaylist: true },
    ])
  })
})

describe('clearVideoCache', () => {
  it('動画キャッシュだけを消す', async () => {
    const { store } = mockCaches({
      [VIDEO_CACHE_NAME]: { [A]: '1' },
      'serwist-precache-v2': { '/x.png': '10' },
    })
    await clearVideoCache()
    expect([...store.keys()]).toEqual(['serwist-precache-v2'])
  })
})

describe('clearEverything', () => {
  it('すべてのキャッシュを消し、Service Worker の登録を外す', async () => {
    const { store } = mockCaches({
      [VIDEO_CACHE_NAME]: { [A]: '1' },
      'serwist-precache-v2': { '/x.png': '10' },
    })
    const unregister = jest.fn(async () => true)
    mockServiceWorker({ unregister })

    await clearEverything()

    expect(store.size).toBe(0)
    expect(unregister).toHaveBeenCalledTimes(1)
  })
})

describe('requestVideoCache', () => {
  it('未保存分だけ取得する依頼を Service Worker に送る', async () => {
    const postMessage = jest.fn()
    mockServiceWorker({ active: { postMessage } })

    expect(await requestVideoCache([A, B])).toBe(true)
    expect(postMessage).toHaveBeenCalledWith({
      type: 'UPDATE_CACHE',
      urls: [A, B],
      onlyMissing: true,
    })
  })

  it('Service Worker が未登録なら何も送らず false を返す', async () => {
    mockServiceWorker(undefined)
    expect(await requestVideoCache([A])).toBe(false)
  })
})
