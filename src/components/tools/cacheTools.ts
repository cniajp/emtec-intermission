import { staticConfig } from '@/staticConfig'

// Service Worker が動画を入れるキャッシュの名前（src/service-worker.js の CACHE_NAME と同じ）
export const VIDEO_CACHE_NAME = 'video-cache'

export type VideoEntry = {
  url: string
  cached: boolean
  // 保存済みのサイズ（バイト）。応答に Content-Length が無ければ null
  bytes: number | null
  // 現在のプレイリスト（staticConfig の page4.playlist）に含まれるか
  inPlaylist: boolean
}

export type CacheSummary = { name: string; count: number }

export type ServiceWorkerStatus =
  // 未対応のブラウザ、または未登録（開発時は Service Worker を無効にしている）
  | { registered: false }
  | {
      registered: true
      // このページを Service Worker が制御しているか（初回はリロードするまで false）
      controlled: boolean
      // 新しい版が待機中か（開いているページをすべて閉じるまで切り替わらない）
      waiting: boolean
    }

export type CacheStatus = {
  serviceWorker: ServiceWorkerStatus
  videos: VideoEntry[]
  caches: CacheSummary[]
  // このサイトが使っている容量と上限（バイト）。取得できなければ null
  storage: { usage: number; quota: number } | null
}

// 静的データ版・Dreamkast 版の両方の Page4 の動画 URL（再生順・重複なし）
export function allVideoUrls(): string[] {
  const urls = Object.values(staticConfig).flatMap((c) =>
    c.page4.playlist.flatMap((item) => item.sources.map((s) => s.src))
  )
  return [...new Set(urls)]
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = 'B'
  for (const u of units) {
    if (value < 1024) break
    value /= 1024
    unit = u
  }
  return `${value.toFixed(1)} ${unit}`
}

async function readVideos(playlist: string[]): Promise<VideoEntry[]> {
  const cache = await caches.open(VIDEO_CACHE_NAME)
  const cachedUrls = (await cache.keys()).map((req) => req.url)
  // プレイリストの順に並べ、プレイリスト外で残っているもの（過去の動画）を後ろに足す
  const urls = [...playlist, ...cachedUrls.filter((u) => !playlist.includes(u))]
  return Promise.all(
    urls.map(async (url) => {
      const res = await cache.match(url)
      const length = res?.headers.get('content-length')
      return {
        url,
        cached: !!res,
        bytes: length ? Number(length) : null,
        inPlaylist: playlist.includes(url),
      }
    })
  )
}

async function readServiceWorker(): Promise<ServiceWorkerStatus> {
  if (!('serviceWorker' in navigator)) return { registered: false }
  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return { registered: false }
  return {
    registered: true,
    controlled: !!navigator.serviceWorker.controller,
    waiting: !!registration.waiting,
  }
}

export async function readCacheStatus(
  playlist: string[] = allVideoUrls()
): Promise<CacheStatus> {
  const names = await caches.keys()
  const summaries = await Promise.all(
    names.map(async (name) => ({
      name,
      count: (await (await caches.open(name)).keys()).length,
    }))
  )
  const estimate = await navigator.storage?.estimate?.().catch(() => null)
  return {
    serviceWorker: await readServiceWorker(),
    videos: await readVideos(playlist),
    caches: summaries,
    storage:
      estimate?.usage != null && estimate.quota != null
        ? { usage: estimate.usage, quota: estimate.quota }
        : null,
  }
}

// 動画キャッシュだけを消す。次に talk ページを開くと取り直される
export async function clearVideoCache(): Promise<void> {
  await caches.delete(VIDEO_CACHE_NAME)
}

// すべてのキャッシュを消し、Service Worker の登録も外す。
// 呼び出し側で再読み込みすると、最新の Service Worker が登録し直される
export async function clearEverything(): Promise<void> {
  const names = await caches.keys()
  await Promise.all(names.map((name) => caches.delete(name)))
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((r) => r.unregister()))
  }
}

// 未保存の動画を Service Worker に取得させる（talk ページを開いたときと同じ依頼）。
// 依頼を送れたら true。Service Worker が未登録なら false
export async function requestVideoCache(
  urls: string[] = allVideoUrls()
): Promise<boolean> {
  if (!('serviceWorker' in navigator) || urls.length === 0) return false
  const registration = await navigator.serviceWorker.getRegistration()
  const worker =
    registration?.active ?? registration?.waiting ?? registration?.installing
  if (!worker) return false
  worker.postMessage({ type: 'UPDATE_CACHE', urls, onlyMissing: true })
  return true
}

// ---- ディレクトリツリー表示用 -------------------------------------------------

export type CacheEntry = {
  cache: string
  url: string
  // 保存されているサイズ（バイト）。分からなければ null
  bytes: number | null
}

export type CacheTreeNode = {
  name: string
  // フォルダなら子を持つ。ファイルなら null
  children: CacheTreeNode[] | null
  // ファイルはそのサイズ、フォルダは配下の合計（サイズ不明のファイルは 0 として数える）
  bytes: number
  // 配下のファイル数（ファイル自身は 1）
  fileCount: number
  // 配下にサイズ不明のファイルがあるか
  hasUnknownSize: boolean
}

// すべてのキャッシュの中身を列挙する。
// サイズは Content-Length を使い、無ければ本体を読んで測る。動画キャッシュは 1 本が
// 数百 MB あるので本体は読まない（Content-Length が無ければ不明のまま）
export async function readCacheEntries(): Promise<CacheEntry[]> {
  const entries: CacheEntry[] = []
  for (const name of await caches.keys()) {
    const cache = await caches.open(name)
    for (const req of await cache.keys()) {
      const res = await cache.match(req)
      const length = res?.headers.get('content-length')
      let bytes: number | null = length ? Number(length) : null
      if (bytes === null && res && name !== VIDEO_CACHE_NAME) {
        bytes = (await res.blob()).size
      }
      entries.push({ cache: name, url: req.url, bytes })
    }
  }
  return entries
}

// キャッシュの URL を、ツリー上のパス（フォルダ名の並び + ファイル名）にする。
// 同じサイトのものはパスだけ、外部のものは先頭にホスト名を付ける。
// プリキャッシュが付ける版管理用のクエリ（__WB_REVISION__）は落とす
export function toTreePath(url: string, origin: string): string[] {
  const u = new URL(url, origin)
  u.searchParams.delete('__WB_REVISION__')
  const segments = u.pathname.split('/').filter(Boolean).map(decodeSegment)
  if (segments.length === 0) segments.push('/')
  if (u.search) segments[segments.length - 1] += u.search
  return u.origin === origin ? segments : [u.host, ...segments]
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

// キャッシュ名 → フォルダ → ファイルのツリーにする。
// フォルダを先、ファイルを後に、それぞれ名前順で並べる
export function buildCacheTree(
  entries: CacheEntry[],
  origin: string
): CacheTreeNode[] {
  const root: CacheTreeNode = folder('')
  for (const entry of entries) {
    const path = [entry.cache, ...toTreePath(entry.url, origin)]
    let node = root
    for (const name of path.slice(0, -1)) {
      let child = node.children!.find((c) => c.children && c.name === name)
      if (!child) {
        child = folder(name)
        node.children!.push(child)
      }
      node = child
    }
    node.children!.push({
      name: path[path.length - 1],
      children: null,
      bytes: entry.bytes ?? 0,
      fileCount: 1,
      hasUnknownSize: entry.bytes === null,
    })
  }
  summarize(root)
  return root.children!
}

function folder(name: string): CacheTreeNode {
  return { name, children: [], bytes: 0, fileCount: 0, hasUnknownSize: false }
}

function summarize(node: CacheTreeNode): void {
  if (!node.children) return
  node.children.forEach(summarize)
  node.children.sort(
    (a, b) =>
      Number(!!b.children) - Number(!!a.children) ||
      a.name.localeCompare(b.name)
  )
  node.bytes = node.children.reduce((sum, c) => sum + c.bytes, 0)
  node.fileCount = node.children.reduce((sum, c) => sum + c.fileCount, 0)
  node.hasUnknownSize = node.children.some((c) => c.hasUnknownSize)
}
