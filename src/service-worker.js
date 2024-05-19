// https://github.com/GoogleChrome/workbox/issues/2519
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = 'video-cache'
const VIDEO_URL = [
  'https://web-intermission.s3.isk01.sakurastorage.jp/cndt2023/cm1.mp4',
  'https://web-intermission.s3.isk01.sakurastorage.jp/cndt2023/cm2.mp4',
  'https://web-intermission.s3.isk01.sakurastorage.jp/cndt2023/cm3.mp4',
]

self.addEventListener('install', (event) => {
  console.warn(
    'Reload is required to activate the service worker since this is the first time to install it. Please reload this page after loading all movies is completed.'
  )
  event.waitUntil(
    Promise.all(
      VIDEO_URL.map(async (url) => {
        console.log('initial: start cache:', url)
        const response = await fetch(url, { mode: 'no-cors' }).catch((e) => {
          console.error('==> failed to fetch video:', e)
          return
        })
        if (!response) {
          return
        }

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(url, response).then(() => {
            console.log('==> cache completed:', url)
          })
        })
      })
    )
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
    console.log('start cache:', event.request.url)
    const response = await fetch(event.request).catch((e) => {
      console.error('==> failed to fetch video:', e)
      return null
    })
    const responseClone = response.clone()
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(event.request, responseClone)
      console.log('==> cache completed:', event.request.url)
    })
    return response
  })()
  if (response) {
    event.respondWith(response)
  }
})
