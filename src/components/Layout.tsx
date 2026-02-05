import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="inline-block rounded bg-white px-3 py-1.5">
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
    <header className="border-b border-neutral-800 px-8 py-3">
      <div
        className={`mx-auto max-w-7xl ${children ? 'flex items-center justify-between' : ''}`}
      >
        <Logo />
        {children}
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 px-8 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
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
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-900">
      <Header />
      <main className="flex flex-1 flex-col p-12">{children}</main>
      <Footer />
    </div>
  )
}
