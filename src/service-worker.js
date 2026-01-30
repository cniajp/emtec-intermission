// https://github.com/GoogleChrome/workbox/issues/2519
import { precacheAndRoute } from 'workbox-precaching'
import { CACHE_VIDEO_URLS, ALLOWED_CACHE_PATHS } from './constants/video-config'

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = 'video-cache'
const VIDEO_URL = CACHE_VIDEO_URLS

async function updateCache() {
  const status = VIDEO_URL.reduce((acc, url) => {
    acc[url] = false
    return acc
  }, {})

  return Promise.all(
    VIDEO_URL.map(async (url) => {
      console.log('start cache update:', url)
      const response = await fetch(url, { mode: 'no-cors' }).catch((e) => {
        console.error('==> failed to fetch video:', e)
        return
      })
      if (!response) {
        return
      }

      caches.open(CACHE_NAME).then((cache) => {
        cache.put(url, response).then(() => {
          status[url] = true
          console.log('==> completed cache update:', url, status)
        })
      })
    })
  )
}

self.addEventListener('install', (event) => {
  console.warn(
    'Reload is required to activate the service worker since this is the first time to install it. Please reload this page after loading all movies is completed.'
  )
  event.waitUntil(updateCache())
})

// https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('fetch', (event) => {
  console.debug('fetch event:', event.request)

  // ビデオファイルでない場合は処理しない
  if (!event.request.url.endsWith('.mp4')) {
    return
  }

  // リファラーをチェックして、特定のパスからのリクエストのみ処理
  const referer = event.request.referrer
  const url = new URL(event.request.url)

  // 許可されたパスからのリクエストのみキャッシュを使用
  const shouldUseCache = ALLOWED_CACHE_PATHS.some((path) =>
    referer.includes(path)
  )

  if (!shouldUseCache) {
    console.log('video cache skipped (not from allowed path):', url.href)
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
    event.waitUntil(updateCache())
    return
  }
  console.warn('unknown message: ', event.data)
})
