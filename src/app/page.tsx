'use client'

import Link from 'next/link'
import config from '@/config'
import { Header, Footer } from '@/components/Layout'
import { talks } from '@/data/talks'

const TOOLS = [
  {
    href: 'https://short.emtec.tv/',
    title: '短縮URL',
    description: 'EMTEC専用短縮URLサービス',
    external: true,
  },
  {
    href: '/tools/pdf',
    title: 'PDF変換ツール',
    description: 'PDFファイルを画像に変換するツール',
  },
  {
    href: '/tools/cache',
    title: 'キャッシュ管理',
    description: '動画キャッシュの確認・事前保存・削除',
  },
] as const

function LinkCard({
  href,
  title,
  description,
  external,
}: {
  href: string
  title: string
  description?: string
  external?: boolean
}) {
  const className =
    'group flex items-center justify-between gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 transition-colors hover:border-neutral-500 hover:bg-neutral-700/50'

  const content = (
    <>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-0.5 text-[12px] text-neutral-400">{description}</p>
        )}
      </div>
      <span className="shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1">
        &rarr;
      </span>
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}

function Section({
  title,
  badge,
  description,
  columns = false,
  children,
}: {
  title: string
  badge: string
  description?: string
  // 広い画面でカードを 2 列に並べるか（日付の一覧用）
  columns?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="w-full">
      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-[18px] font-bold text-white">{title}</h2>
          <span className="rounded-full bg-blue-600/20 px-2.5 py-0.5 text-[11px] font-medium text-blue-400">
            {badge}
          </span>
        </div>
        {description && (
          <p className="mt-1 text-[12px] text-neutral-400">{description}</p>
        )}
      </div>
      <div className={`grid gap-2.5 ${columns ? 'sm:grid-cols-2' : ''}`}>
        {children}
      </div>
    </section>
  )
}

export default function Home() {
  const { dkEventAbbr, eventAbbr } = config

  const staticDays = talks?.length
    ? [
        ...new Set(
          talks
            .map((talk) => talk.conferenceDayId)
            .filter((id): id is number => id != null)
        ),
      ]
        .sort((a, b) => a - b)
        .map((day) => {
          const talk = talks.find(
            (t) => t.conferenceDayId === day && t.startTime
          )
          const date = talk?.startTime ? new Date(talk.startTime) : null
          const weekdays = ['日', '月', '火', '水', '木', '金', '土']
          return {
            day,
            date: date
              ? `${date.getMonth() + 1}/${date.getDate()}(${weekdays[date.getDay()]})`
              : null,
          }
        })
    : []

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header />

      {/* このサイトの文字サイズ表（tailwind.css の @theme）は 1920x1080 の配信画面向けに大きいので、
          このページの文字サイズは px で直接指定している */}
      <main className="flex flex-1 flex-col px-4 py-8 text-[14px] sm:p-12">
        {/* 狭い画面では 1 列、広い画面では「日付の一覧」と「ツール」の 2 列 */}
        <div className="mx-auto grid w-full max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-10">
            <Section
              title="Dreamkast API"
              badge={dkEventAbbr}
              description="Dreamkast APIからトーク情報を取得"
              columns
            >
              <LinkCard href="/break-dk/menu/1" title="Day 1" />
              <LinkCard href="/break-dk/menu/2" title="Day 2" />
            </Section>

            {staticDays.length > 0 && (
              <Section
                title="静的TSファイル"
                badge={eventAbbr}
                description="src/data/talks.ts からトーク情報を取得"
                columns
              >
                {staticDays.map(({ day, date }) => (
                  <LinkCard
                    key={day}
                    href={`/break/menu/${day}`}
                    title={`Day ${day}${date ? ` : ${date}` : ''}`}
                  />
                ))}
              </Section>
            )}
          </div>

          <div>
            <Section title="ツール" badge="Utilities">
              {TOOLS.map((tool) => (
                <LinkCard key={tool.href} {...tool} />
              ))}
            </Section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
