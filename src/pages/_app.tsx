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

      navigator.serviceWorker.getRegistration().then((reg) => {
        console.log('[Cache] getRegistration:', reg)
        console.log('[Cache] installing:', reg?.installing)
        console.log('[Cache] waiting:', reg?.waiting)
        console.log('[Cache] active:', reg?.active)
      })

      navigator.serviceWorker.ready.then((registration) => {
        console.log('[Cache] SW ready, active:', registration.active)
        console.log('[Cache] Requesting video cache update...')
        registration.active?.postMessage({ type: 'UPDATE_CACHE' })
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
