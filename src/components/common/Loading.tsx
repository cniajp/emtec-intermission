import Image from 'next/image'

type LoadingProps = {
  logoPath?: string
  isFadingOut?: boolean
}

export default function Loading({
  logoPath = '/intermission.png',
  isFadingOut = false,
}: LoadingProps) {
  return (
    <div className="h-full w-full loading-container">
      <div className="loading-logo-container">
        <Image
          src={logoPath}
          alt="Logo"
          width={400}
          height={100}
          className={`loading-logo ${isFadingOut ? 'loading-logo-fade-out' : ''}`}
          priority
        />
      </div>
    </div>
  )
}
