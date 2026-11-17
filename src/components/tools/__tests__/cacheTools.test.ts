import {
  VIDEO_CACHE_NAME,
  allVideoUrls,
  buildCacheTree,
  fileKind,
  filterCacheEntries,
  summarizeByKind,
  toTreePath,
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

describe('toTreePath', () => {
  const origin = 'https://im.emtec.tv'

  it('同じサイトの URL はパスだけにする', () => {
    expect(
      toTreePath('https://im.emtec.tv/jisaba2026/bgm/a.mp3', origin)
    ).toEqual(['jisaba2026', 'bgm', 'a.mp3'])
  })

  it('外部の URL は先頭にホスト名を付ける', () => {
    expect(
      toTreePath('https://im-file.emtec.tv/ev/opening.mp4', origin)
    ).toEqual(['im-file.emtec.tv', 'ev', 'opening.mp4'])
  })

  it('版管理用のクエリは落とし、それ以外のクエリは残す', () => {
    expect(
      toTreePath('https://im.emtec.tv/ev/logo.png?__WB_REVISION__=abc', origin)
    ).toEqual(['ev', 'logo.png'])
    expect(
      toTreePath('https://im.emtec.tv/_next/image?url=x&w=640', origin)
    ).toEqual(['_next', 'image?url=x&w=640'])
  })

  it('エンコードされた名前は読める形に戻す', () => {
    expect(
      toTreePath('https://im.emtec.tv/ev/%E8%83%8C%E6%99%AF.png', origin)
    ).toEqual(['ev', '背景.png'])
  })

  it('トップページは "/" として表示する', () => {
    expect(toTreePath('https://im.emtec.tv/', origin)).toEqual(['/'])
  })
})

describe('buildCacheTree', () => {
  const origin = 'https://im.emtec.tv'
  const tree = buildCacheTree(
    [
      { cache: 'precache', url: `${origin}/ev/logo.png`, bytes: 100 },
      { cache: 'precache', url: `${origin}/ev/bgm/b.mp3`, bytes: 3000 },
      { cache: 'precache', url: `${origin}/ev/bgm/a.mp3`, bytes: 2000 },
      { cache: 'precache', url: `${origin}/manifest.json`, bytes: 10 },
      {
        cache: VIDEO_CACHE_NAME,
        url: 'https://im-file.emtec.tv/ev/opening.mp4',
        bytes: null,
      },
    ],
    origin
  )

  it('キャッシュ名 → フォルダ → ファイルの階層にする', () => {
    expect(tree.map((n) => n.name)).toEqual(['precache', VIDEO_CACHE_NAME])
    const precache = tree[0]
    // フォルダが先、ファイルが後。それぞれ名前順
    expect(precache.children!.map((n) => n.name)).toEqual([
      'ev',
      'manifest.json',
    ])
    const ev = precache.children![0]
    expect(ev.children!.map((n) => n.name)).toEqual(['bgm', 'logo.png'])
    expect(ev.children![0].children!.map((n) => n.name)).toEqual([
      'a.mp3',
      'b.mp3',
    ])
  })

  it('フォルダは配下のファイル数と合計サイズを持つ', () => {
    const precache = tree[0]
    expect(precache.fileCount).toBe(4)
    expect(precache.bytes).toBe(5110)
    expect(precache.hasUnknownSize).toBe(false)
    const bgm = precache.children![0].children![0]
    expect(bgm.fileCount).toBe(2)
    expect(bgm.bytes).toBe(5000)
  })

  it('サイズ不明のファイルがあるフォルダには印が付く', () => {
    const video = tree[1]
    expect(video.fileCount).toBe(1)
    expect(video.bytes).toBe(0)
    expect(video.hasUnknownSize).toBe(true)
    expect(video.children![0].name).toBe('im-file.emtec.tv')
  })
})

describe('fileKind', () => {
  it('拡張子から種類を決める（大文字小文字・クエリは無視）', () => {
    expect(fileKind('logo.PNG')).toBe('image')
    expect(fileKind('bgm.mp3')).toBe('audio')
    expect(fileKind('opening_v9.mp4')).toBe('video')
    expect(fileKind('chunk.js')).toBe('script')
    expect(fileKind('app.css')).toBe('style')
    expect(fileKind('font.woff2')).toBe('font')
    expect(fileKind('manifest.json')).toBe('data')
    expect(fileKind('a.png?v=2')).toBe('image')
  })

  it('拡張子が無いものはページ、知らない拡張子はその他', () => {
    expect(fileKind('menu')).toBe('page')
    expect(fileKind('/')).toBe('page')
    expect(fileKind('image?url=x&w=640')).toBe('page')
    expect(fileKind('archive.zip')).toBe('other')
  })
})

describe('並び替え・絞り込み・種類別の内訳', () => {
  const origin = 'https://im.emtec.tv'
  const entries = [
    { cache: 'precache', url: `${origin}/ev/logo.png`, bytes: 100 },
    { cache: 'precache', url: `${origin}/ev/bgm/a.mp3`, bytes: 2000 },
    { cache: 'precache', url: `${origin}/ev/bgm/b.mp3`, bytes: 3000 },
    { cache: 'precache', url: `${origin}/zzz.png`, bytes: 9000 },
    {
      cache: VIDEO_CACHE_NAME,
      url: 'https://im-file.emtec.tv/ev/opening.mp4',
      bytes: null,
    },
  ]

  it("sort が 'size' なら、フォルダとファイルを混ぜて大きい順に並べる", () => {
    const precache = buildCacheTree(entries, origin, 'size')[0]
    expect(precache.children!.map((n) => n.name)).toEqual(['zzz.png', 'ev'])
    const ev = precache.children![1]
    expect(ev.children!.map((n) => n.name)).toEqual(['bgm', 'logo.png'])
    expect(ev.children![0].children!.map((n) => n.name)).toEqual([
      'b.mp3',
      'a.mp3',
    ])
  })

  it('ファイルには種類と URL が付く', () => {
    const file = buildCacheTree(entries, origin)[0].children![1]
    expect(file).toMatchObject({
      name: 'zzz.png',
      kind: 'image',
      url: `${origin}/zzz.png`,
    })
  })

  it('名前のどこかに一致するものだけ残す（大文字小文字は区別しない）', () => {
    expect(
      filterCacheEntries(entries, 'BGM', origin).map((e) => e.url)
    ).toEqual([`${origin}/ev/bgm/a.mp3`, `${origin}/ev/bgm/b.mp3`])
    // キャッシュ名・外部のホスト名でも探せる
    expect(filterCacheEntries(entries, 'video-cache', origin)).toHaveLength(1)
    expect(filterCacheEntries(entries, 'im-file', origin)).toHaveLength(1)
    expect(filterCacheEntries(entries, '  ', origin)).toHaveLength(5)
  })

  it('種類別の合計を大きい順に返す', () => {
    expect(summarizeByKind(entries, origin)).toEqual([
      { kind: 'image', bytes: 9100, count: 2 },
      { kind: 'audio', bytes: 5000, count: 2 },
      { kind: 'video', bytes: 0, count: 1 },
    ])
  })
})
