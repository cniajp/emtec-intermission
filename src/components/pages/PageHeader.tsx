import { Optional } from '@/utils/types'
import { TalkView } from '../models/talkView'
import { PageCtx } from '../models/pageContext'
import { useContext } from 'react'
import Image from 'next/image'
import config from '@/config'
import { trim } from '@/utils/utils'
import { staticConfig } from '@/staticConfig'

type Props = { view: Optional<TalkView>; isDk: boolean }

export default function Header({ view, isDk }: Props) {
  const { now } = useContext(PageCtx)
  const { eventAbbr, dkEventAbbr } = config
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <div>No talks left.</div>
  }
  const eventAbbrToShow = isDk ? dkEventAbbr : eventAbbr
  if (!eventAbbrToShow) {
    return <div>No eventAbbr configured.</div>
  }
  const hashTag = isDk
    ? staticConfig.breakDk.base.hashTag
    : staticConfig.break.base.hashTag

  return (
    <div className="px-[20px] pb-[15px] flex flex-row items-center w-[1880px] h-[140px] text-[#1E1E1E] font-din-2014 font-bold bg-[linear-gradient(to_bottom,rgba(255,255,255,0.5)_80%,rgba(255,255,255,0)_100%)]">
      {/* イベントタイトル */}
      <div className="basis-1/3 flex justify-center items-center">
        <Image src="/cnk2026/title.png" alt="logo" width={500} height={130} />
      </div>

      {/* 現在時刻 */}
      <div className="basis-1/3 text-center font-video-cond">
        <span className="text-5xl tracking-wider">
          {now.format('HH:mm:ss')}
        </span>
      </div>

      {/* ルーム・ハッシュタグ */}
      <div className="basis-1/3 flex flex-row font-semibold">
        <div className="basis-1/3 flex flex-col items-center">
          {/* ルーム */}
          <div className="text-xs">トラック</div>
          <div className="h-[76px] text-4xl">
            {trim(view.selectedTrack.name, 30)}
          </div>
        </div>

        <div className="basis-2/3 flex flex-col items-center">
          {/* ハッシュタグ */}
          <div className="text-center text-xs">ハッシュタグ</div>
          <div>
            <div className="text-left text-xl">#{hashTag.all}</div>
            <div className="text-left text-xl">
              #{hashTag.break + view.selectedTrack.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
