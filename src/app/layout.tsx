import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EMTEC Intermission',
  description:
    'EMTEC Intermission is a web application for generating Intermission for use in streaming.',
}

export default function RootLayout({
  children,
  folder1,
}: {
  children: React.ReactNode
  folder1: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
