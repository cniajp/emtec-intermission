'use client'

import Link from 'next/link'
import config from '@/config'

export default function Home() {
  const { dkEventAbbr, eventAbbr } = config

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly p-24">
      <h1 className={`text-4xl`}>EMTEC Intermission</h1>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className='text-center my-auto'>{dkEventAbbr}</div>
        <Link
          href="/break-dk/menu/0"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Dreamkast で利用(Day1分){' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            CloudNativeDays イベントのインタミはこちら.
          </p>
        </Link>

        <Link
          href="/break-dk/menu/1"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Dreamkast で利用(Day2分){' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            CloudNativeDays イベントのインタミはこちら.
          </p>
        </Link>

        <div className='text-center my-auto'>{eventAbbr}</div>
        <Link
          href="/break/menu/1"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            TS ファイルをソースとして利用(Day1分){' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            src/data/talks.ts に書き込んだ
            トーク情報からインタミを生成する場合はこちら.
          </p>
        </Link>

        <Link
          href="/break/menu/2"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            TS ファイルをソースとして利用(Day2分){' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            src/data/talks.ts に書き込んだ
            トーク情報からインタミを生成する場合はこちら.
          </p>
        </Link>
      </div>
    </main>
  )
}
