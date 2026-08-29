import './globals.css'
import { SerwistProvider } from '@serwist/turbopack/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

// next-pwa と同じく開発時は Service Worker を無効にする
const disableSW = process.env.NODE_ENV !== 'production'

export const metadata: Metadata = {
  title: 'EMTEC Intermission',
  description:
    'EMTEC Intermission is a web application for generating Intermission for use in streaming.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SerwistProvider
          swUrl="/serwist/sw.js"
          disable={disableSW}
          cacheOnNavigation={false}
        >
          {children}
        </SerwistProvider>
      </body>
    </html>
  )
}
