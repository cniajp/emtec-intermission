import { Optional } from '@/utils/types'
import { TalkView } from '@/logic/models/talkView'
import { getTimeStr } from '@/utils/time'
import { SpeakerCards } from './SpeakerCards'
import { useBrand } from '@/brand/BrandProvider'
import { PhraseText } from '@/components/common/PhraseText'
import { ShrinkToFit } from '@/components/common/ShrinkToFit'

type Props = { view: Optional<TalkView> }

export function Main({ view }: Props) {
  const brand = useBrand()
  if (!view) {
    return <></>
  }
  const talk = view.talksLeftInSameTrack()[0]
  if (!talk) {
    return <></>
  }
  const speakers = view.speakersOf(talk.id)
  const hasMeta = !!(talk.talkCategory || talk.talkDifficulty)

  return (
    <div className="mt-4 mb-16">
      <div className="text-left w-[500px] pr-10 py-10 bg-[#ffffff] bg-cover bg-center rounded-r-2xl">
        <div className="text-right text-[#1E1E1E] font-bold font-din-2014 tracking-wide text-2xl">
          UPCOMING SESSION
        </div>
      </div>
      <div
        className={`top-[55px] left-[120px] w-[1000px] ${hasMeta ? 'h-[668px]' : 'h-[630px]'} relative rounded-lg`}
        style={{
          backgroundColor: brand.page1.cardBackgroundColor,
          color: brand.page1.cardTextColor,
        }}
      >
        <div className="text-center py-2 text-2xl text-white bg-[#1E1E1E] font-din-2014 font-medium rounded-t-lg">
          {getTimeStr(talk.startTime)} - {getTimeStr(talk.endTime)}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="h-[208px] px-12 py-6 w-full font-ryo-gothic-plusn flex items-center justify-center">
            <ShrinkToFit
              className="text-center text-3xl font-bold break-keep wrap-anywhere text-balance"
              resetKey={talk.title}
            >
              <PhraseText text={talk.title} />
            </ShrinkToFit>
          </div>
          <SpeakerCards speakers={speakers} />
          <div className="p-6 font-ryo-gothic-plusn text-white">
            {hasMeta && (
              <div className="text-base text-gray-300 pb-2">
                {talk.talkCategory && (
                  <span className="mr-5">Category: {talk.talkCategory}</span>
                )}
                {talk.talkDifficulty && (
                  <span className="mr-5">
                    Difficulty: {talk.talkDifficulty}
                  </span>
                )}
              </div>
            )}
            <div className="text-base text-white line-clamp-4">
              {talk.abstract && (
                <span>
                  {brand.showAbstractPrefix && 'Abstract: '}
                  {talk.abstract}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
