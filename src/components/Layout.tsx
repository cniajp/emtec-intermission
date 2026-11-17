import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="inline-block rounded-sm bg-white px-3 py-1.5">
      <Image
        src="/intermission.png"
        alt="EMTEC Intermission"
        width={200}
        height={50}
        priority
        className="h-8 w-auto"
      />
    </Link>
  )
}

type HeaderProps = {
  children?: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="border-b border-neutral-800 px-4 py-3 sm:px-8">
      <div
        // 狭い画面では、ロゴと右側の内容（メニューの日付切り替え）を折り返す
        className={`mx-auto max-w-7xl ${children ? 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2' : ''}`}
      >
        <Logo />
        {children}
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p className="text-[13px] text-neutral-500">
          &copy; {new Date().getFullYear()} EMTEC
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/cloudnativedaysjp/emtec-intermission"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-neutral-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://emtec.tv/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-neutral-400 hover:text-white transition-colors"
          >
            EMTEC
          </a>
        </div>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header />
      {/* スマートフォンでは余白を詰める（sm 以上はこれまでと同じ） */}
      <main className="flex flex-1 flex-col p-4 sm:p-12">{children}</main>
      <Footer />
    </div>
  )
}
