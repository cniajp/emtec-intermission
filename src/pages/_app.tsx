import './globals.css'
import { wrapper } from '@/store'
import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'

const RootApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: 'UPDATE_CACHE' })
      })
    }
  }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default RootApp
