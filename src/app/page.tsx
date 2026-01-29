'use client'

import Link from 'next/link'
import Image from 'next/image'
import config from '@/config'
import { talks } from '@/data/talks'

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
    'group flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800/50 px-5 py-4 transition-colors hover:border-neutral-500 hover:bg-neutral-700/50'

  const content = (
    <>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-neutral-400">{description}</p>
        )}
      </div>
      <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
        &rarr;
      </span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
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
  children,
}: {
  title: string
  badge: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="w-full max-w-2xl">
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-400">
            {badge}
          </span>
        </div>
        {description && (
          <p className="mt-1 text-sm text-neutral-400">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
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
          const talk = talks.find((t) => t.conferenceDayId === day && t.startTime)
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
      <header className="border-b border-neutral-800 px-12 py-3">
        <div className="mx-auto max-w-5xl">
          <div className="inline-block rounded bg-white px-3 py-1.5">
            <Image
              src="/intermission.png"
              alt="EMTEC Intermission"
              width={200}
              height={50}
              priority
              className="h-8 w-auto"
            />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col p-12">
        <div className="mx-auto flex w-full max-w-5xl flex-1 items-start gap-8">
          <div className="flex w-3/4 flex-col gap-12">
            <Section
              title="Dreamkast API"
              badge={dkEventAbbr}
              description="Dreamkast APIからトーク情報を取得"
            >
              <LinkCard href="/break-dk/menu/1" title="Day 1" />
              <LinkCard href="/break-dk/menu/2" title="Day 2" />
            </Section>

            {staticDays.length > 0 && (
              <Section
                title="静的TSファイル"
                badge={eventAbbr}
                description="src/data/talks.ts からトーク情報を取得"
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

          <div className="w-1/4">
            <Section title="ツール" badge="Utilities">
              <LinkCard
                href="/break-dk/monitor"
                title="Monitor"
                description="全トラックの状態を監視 (Dreamkast専用)"
              />
              <LinkCard
                href="https://short.emtec.tv/"
                title="短縮URL"
                description="EMTEC専用短縮URLサービス"
                external
              />
            </Section>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 px-12 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} EMTEC
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/cloudnativedaysjp/emtec-intermission"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://emtec.tv/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              EMTEC
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
