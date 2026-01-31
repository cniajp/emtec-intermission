import './globals.css'
import { wrapper } from '@/store'
import { initFaro } from '@/lib/faro'
import type { AppProps } from 'next/app'
import { FC, useEffect } from 'react'
import { Provider } from 'react-redux'

const RootApp: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { pageProps } = props

  useEffect(() => {
    initFaro()
  }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default RootApp
