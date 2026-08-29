import { Serwist } from 'serwist'

// `self.__SW_MANIFEST` はビルド時にプリキャッシュ一覧へ置換される。
// skipWaiting / clientsClaim は有効にしない（下の install リスナが警告している通り、
// 初回インストール後はリロードで有効化する挙動を維持する）。
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // 世代交代した古いプリキャッシュ（`-precache-` を含むキャッシュ）を activate 時に削除する。
  // next-pwa から移行した際の `workbox-precache-v2-*` のような孤児が溜まるのを防ぐ。
  // `video-cache` は名前に `-precache-` を含まないので影響を受けない。
  cleanupOutdatedCaches: true,
})

// プリキャッシュ用の fetch リスナを先に登録しておく。
// 下の .mp4 用リスナは、プリキャッシュが応答しなかったときだけ respondWith する。
serwist.addEventListeners()

const CACHE_NAME = 'video-cache'

async function updateCache(urls) {
  if (!Array.isArray(urls) || urls.length === 0) {
    console.warn('updateCache: skip — no urls')
    return
  }

  const status = urls.reduce((acc, url) => {
    acc[url] = false
    return acc
  }, {})

  return Promise.all(
    urls.map(async (url) => {
      console.log('start cache update:', url)
      // `cache: 'reload'` で HTTP キャッシュを迂回して必ずネットワークから取り直す。
      // 動画配信元は Origin ヘッダ付きのリクエストにしか CORS ヘッダを返さない。
      // <video> は crossorigin 無し（no-cors・Origin ヘッダ無し）で取りに行くので、
      // 一度再生すると ACAO も Vary も持たないレスポンスが HTTP キャッシュに残る。
      // Vary が無いエントリは後続のどのリクエストにもマッチしてしまうため、
      // ここで素の fetch を使うとそれを再利用して CORS エラーになる。
      const response = await fetch(url, { cache: 'reload' }).catch((e) => {
        console.error('==> failed to fetch video:', e)
        return
      })
      if (!response || !response.ok) {
        console.error(
          '==> bad response for cache update:',
          url,
          response?.status
        )
        return
      }

      // put を await する。await しないと event.waitUntil が書き込み完了前に解決し、
      // quota 超過などの失敗も未処理の rejection として握り潰されてしまう。
      try {
        const cache = await caches.open(CACHE_NAME)
        await cache.put(url, response)
        status[url] = true
        console.log('==> completed cache update:', url, status)
      } catch (e) {
        console.error('==> failed to store video:', url, e)
      }
    })
  )
}

self.addEventListener('install', () => {
  console.warn(
    'Reload is required to activate the service worker since this is the first time to install it. Please reload this page after loading all movies is completed.'
  )
})

// https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('fetch', (event) => {
  console.debug('fetch event:', event.request)
  if (!event.request.url.endsWith('.mp4')) {
    return
  }
  console.log('video request: url:', event.request.url)

  const response = (async () => {
    const cache = await caches.match(event.request)
    if (cache) {
      console.log('==> cache hit:', event.request.url)
      return cache
    }
    console.warn(
      '==> fallback to stream since no cache hit:',
      event.request.url
    )
    return await fetch(event.request)
  })()
  event.respondWith(response)
})

self.addEventListener('message', (event) => {
  console.log('message:', event.data)
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    event.waitUntil(updateCache(event.data.urls))
    return
  }
  console.warn('unknown message: ', event.data)
})
