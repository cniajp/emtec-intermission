// https://github.com/GoogleChrome/workbox/issues/2519
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

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
      const response = await fetch(url).catch((e) => {
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

      caches.open(CACHE_NAME).then((cache) => {
        cache.put(url, response).then(() => {
          status[url] = true
          console.log('==> completed cache update:', url, status)
        })
      })
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
