// https://github.com/GoogleChrome/workbox/issues/2519
import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = 'video-cache'
const VIDEO_URL = [
  'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/srekaigi2026/makuai.mp4',
]

async function notifyClients(message) {
  const clients = await self.clients.matchAll()
  clients.forEach((client) => client.postMessage(message))
}

async function updateCache() {
  await notifyClients({ type: 'CACHE_UPDATE_START', urls: VIDEO_URL })

  return Promise.all(
    VIDEO_URL.map(async (url) => {
      await notifyClients({ type: 'CACHE_DOWNLOAD_START', url })
      const response = await fetch(url).catch((e) => {
        notifyClients({ type: 'CACHE_DOWNLOAD_ERROR', url, error: e.message })
        return
      })
      if (!response) {
        return
      }

      const cache = await caches.open(CACHE_NAME)
      await cache.put(url, response)
      await notifyClients({ type: 'CACHE_DOWNLOAD_COMPLETE', url })
    })
  )
}

self.addEventListener('install', (_event) => {
  console.log('Service Worker installing, skipping wait...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating, claiming clients...')
  event.waitUntil(self.clients.claim())
})

// https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('fetch', (event) => {
  console.debug('fetch event:', event.request)
  if (!event.request.url.endsWith('.mp4')) {
    return
  }
  console.log('video request: url:', event.request.url)

  const response = (async () => {
    // ignoreVary: true で Range ヘッダー等を無視してマッチさせる
    const cached = await caches.match(event.request.url, { ignoreVary: true })
    if (cached) {
      console.log('==> cache hit:', event.request.url)
      return cached
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
