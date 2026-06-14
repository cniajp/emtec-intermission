import { staticConfig } from '@/staticConfig'

export function Page3ImagePreLoader({ isDk }: { isDk: boolean }) {
  const { alias, images } = isDk
    ? staticConfig.breakDk.page3
    : staticConfig.break.page3
  const first = images[0]
  if (!first) return <></>
  return (
    <div className="hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/${alias}/${first}`} alt="for preload" />
    </div>
  )
}
