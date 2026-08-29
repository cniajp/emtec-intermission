import { Optional } from '@/utils/types'
import { TalkView } from '@/logic/models/talkView'
import { PageCtx } from '@/logic/page-flow/PageContext'
import { useContext } from 'react'
import Image from 'next/image'
import config from '@/config'
import { trim } from '@/utils/utils'
import { useBrand } from '@/brand/BrandProvider'

type Props = { view: Optional<TalkView> }

export default function Header({ view }: Props) {
  const brand = useBrand()
  const { now } = useContext(PageCtx)
  const eventAbbrToShow = config[brand.eventAbbrConfigKey]
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <div>No talks left.</div>
  }
  if (!eventAbbrToShow) {
    return <div>No eventAbbr configured.</div>
  }
  const { hashTag, useHashTagAsTrackName } = brand.base
  const trackHashTag =
    brand.useTrackHashTagProperty && view.selectedTrack.hashTag
      ? hashTag.break + view.selectedTrack.hashTag
      : hashTag.break + view.selectedTrack.name
  const trackName =
    useHashTagAsTrackName && view.selectedTrack.hashTag
      ? view.selectedTrack.hashTag.toUpperCase()
      : view.selectedTrack.name

  return (
    <div className="px-[20px] py-[7.5px] flex flex-row items-center w-[1920px] h-[140px] text-[#ffffff] font-din-2014 font-bold">
      {/* イベントタイトル */}
      <div className="basis-1/3 flex justify-center items-center">
        <Image
          src={brand.headerLogoSrc}
          alt="logo"
          width={450}
          height={110}
          style={{ width: '450px', height: 'auto' }}
          priority
        />
      </div>

      {/* 現在時刻 */}
      <div className="basis-1/3 text-center">
        <span className="text-5xl tracking-wider">
          {now.format('HH:mm:ss')}
        </span>
      </div>

      {/* ルーム・ハッシュタグ */}
      <div className="basis-1/3 flex flex-row font-semibold">
        <div className="basis-1/3 flex flex-col items-center">
          {/* ルーム */}
          <div className="text-xs">トラック</div>
          <div className="h-[76px] text-4xl">{trim(trackName, 30)}</div>
        </div>

        <div className="basis-2/3 flex flex-col items-center">
          {/* ハッシュタグ */}
          <div className="text-center text-xs">ハッシュタグ</div>
          <div>
            <div className="text-left text-xl">#{hashTag.all}</div>
            <div className="text-left text-xl">#{trackHashTag}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
