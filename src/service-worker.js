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

// 動画は 1 本ずつ、渡された順（＝再生順）に取得する。
// 同時に取得すると帯域を分け合い、最初に再生する動画まで Page4 に間に合わなくなる
// （300MB × 2 本を 32Mbps で取ると、同時なら 2 本とも約 155 秒、順番なら 1 本目は約 80 秒）。
// 依頼（メッセージ）どうしも直列にする。複数のページ（OBS のブラウザソース）から同時に
// 依頼されても、後の依頼は前の依頼が終わってから始まり、取得済みの動画を読み飛ばす。
let queue = Promise.resolve()

function updateCache(urls, options) {
  const run = queue.then(() => updateCacheNow(urls, options))
  // 前の依頼が失敗しても、次の依頼は実行する
  queue = run.catch(() => {})
  return run
}

// onlyMissing: true なら、すでに video-cache にある URL は取り直さない
// （ページ表示のたびに送られてくる自動キャッシュ用）。
// false は debug の「Update Video Cache」ボタン用で、必ず取り直す。
async function updateCacheNow(urls, { onlyMissing = false } = {}) {
  if (!Array.isArray(urls) || urls.length === 0) {
    console.warn('updateCache: skip — no urls')
    return
  }

  const status = urls.reduce((acc, url) => {
    acc[url] = false
    return acc
  }, {})

  const cache = await caches.open(CACHE_NAME)
  for (const url of urls) {
    if (onlyMissing && (await cache.match(url))) {
      status[url] = true
      console.log('skip cache update (already cached):', url)
      continue
    }

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
      console.error('==> bad response for cache update:', url, response?.status)
      continue
    }

    // put を await する。await しないと event.waitUntil が書き込み完了前に解決し、
    // quota 超過などの失敗も未処理の rejection として握り潰されてしまう。
    // 本体の受信が終わるのもここなので、次の動画の取得はこの後に始まる。
    try {
      await cache.put(url, response)
      status[url] = true
      console.log('==> completed cache update:', url, status)
    } catch (e) {
      console.error('==> failed to store video:', url, e)
    }
  }
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
    event.waitUntil(
      updateCache(event.data.urls, { onlyMissing: !!event.data.onlyMissing })
    )
    return
  }
  console.warn('unknown message: ', event.data)
})
