import './globals.css'
import { wrapper } from '@/store'
import { initFaro } from '@/lib/faro'
import { SerwistProvider } from '@serwist/turbopack/react'
import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'

// next-pwa と同じく開発時は Service Worker を無効にする
const disableSW = process.env.NODE_ENV !== 'production'

const RootApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props

  useEffect(() => {
    initFaro()
  }, [])

  return (
    // cacheOnNavigation は無効。この SW はページのランタイムキャッシュを持たず、
    // .mp4 の明示的なキャッシュ（UPDATE_CACHE メッセージ）だけを担当する。
    <SerwistProvider
      swUrl="/serwist/sw.js"
      disable={disableSW}
      cacheOnNavigation={false}
    >
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SerwistProvider>
  )
}

export default RootApp
