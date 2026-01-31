import './globals.css'
import { wrapper } from '@/store'
import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'

const RootApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props

  useEffect(() => {
    console.log('[Cache] useEffect triggered')
    if ('serviceWorker' in navigator) {
      console.log('[Cache] serviceWorker supported')
      console.log('[Cache] controller:', navigator.serviceWorker.controller)

      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, url, urls, error } = event.data
        switch (type) {
          case 'CACHE_UPDATE_START':
            console.log('[Cache] Starting video cache update:', urls)
            break
          case 'CACHE_DOWNLOAD_START':
            console.log('[Cache] Downloading:', url)
            break
          case 'CACHE_DOWNLOAD_COMPLETE':
            console.log('[Cache] Complete:', url)
            break
          case 'CACHE_DOWNLOAD_ERROR':
            console.error('[Cache] Error:', url, error)
            break
        }
      })

      const requestCacheUpdate = () => {
        navigator.serviceWorker.controller?.postMessage({
          type: 'UPDATE_CACHE',
        })
        console.log('[Cache] Requested video cache update')
      }

      // 既に controller がある場合（2回目以降のアクセス）
      if (navigator.serviceWorker.controller) {
        console.log('[Cache] Controller already active')
        requestCacheUpdate()
      }

      // 初回アクセス時: SW が active になったら発火
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[Cache] Controller changed, SW now active')
        requestCacheUpdate()
      })
    } else {
      console.log('[Cache] serviceWorker NOT supported')
    }
  }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default RootApp
