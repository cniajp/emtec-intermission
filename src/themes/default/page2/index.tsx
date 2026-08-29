import type { Speaker, Talk, Track } from '@/data/types'
import type { Page2PresenterProps } from '@/themes/types'
import { useBrand } from '@/brand/BrandProvider'
import PageHeader from '../PageHeader'
import { getTimeStr } from '@/utils/time'
import {
  useAvatarSlider,
  ANIMATION_DURATION_SEC,
} from '@/components/hooks/useAvatarSlider'
import { RollingAvatar } from '@/components/avatar/RollingAvatar'

export { AvatarPreLoader } from './AvatarPreLoader'
export { Page3ImagePreLoader } from './Page3ImagePreLoader'

const TRACK_BG_COLORS = ['#f14e35', '#387c61', '#e5b73d']

export default function Page2Presenter({
  view,
  timeRange,
  rows,
}: Page2PresenterProps) {
  return (
    <div>
      <PageHeader view={view} />
      <div className="h-full">
        <Body timeRange={timeRange} rows={rows} />
      </div>
    </div>
  )
}

function Body({
  timeRange,
  rows,
}: {
  timeRange: Page2PresenterProps['timeRange']
  rows: Page2PresenterProps['rows']
}) {
  if (!timeRange || rows.length === 0) {
    return <></>
  }
  return (
    <div className=" mt-10 font-ryo-gothic-plusn">
      <div className="text-left w-[450px] pr-10 py-10 bg-[url('/cnk2026/background.jpg')] bg-cover bg-center rounded-r-2xl">
        <div className="text-right text-[#1E1E1E] font-bold font-din-2014 tracking-wide text-1.5xl">
          UPCOMING SESSIONS
        </div>
        <div className="text-right text-[#1E1E1E] font-bold font-din-2014 text-1.5xl">
          {getTimeStr(timeRange.start)}-{getTimeStr(timeRange.end)}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 justify-items-center">
        {rows.map((row) => (
          <TrackRow
            key={row.track.id}
            talk={row.talk}
            track={row.track}
            speakers={row.speakers}
            bgColor={TRACK_BG_COLORS[row.trackIndex % TRACK_BG_COLORS.length]}
          />
        ))}
      </div>
    </div>
  )
}

type TrackProps = {
  talk: Talk
  track: Track
  speakers: Speaker[]
  bgColor: string
}

function TrackRow({ talk, track, speakers, bgColor }: TrackProps) {
  const brand = useBrand()
  const defaultAvatar = brand.base.defaultAvatarSrc
  const { currentIndex, prevIndex, isSliding } = useAvatarSlider(
    speakers.length
  )

  if (!talk || !track) {
    return <></>
  }
  const re = /(https:\/\/.*|\/.*)/

  const getAvatarUrl = (index: number) => {
    const speaker = speakers[index]
    return re.test(speaker?.avatarUrl || '') ? speaker.avatarUrl! : null
  }

  const currentAvatarUrl = getAvatarUrl(currentIndex)
  const prevAvatarUrl = getAvatarUrl(prevIndex)
  const currentSpeaker = speakers[currentIndex]

  return (
    <div className="relative flex flex-row items-center w-[900px] h-[300px] mt-12 backdrop-blur-xl bg-white/30 border border-white/30 rounded-2xl shadow-2xl text-[#1E1E1E] p-6">
      <span
        className="absolute top-3 left-4 inline-block px-3 py-1 rounded-full text-sm uppercase tracking-widest font-din-2014 font-bold text-white"
        style={{ backgroundColor: bgColor }}
      >
        TRACK {track.name}
      </span>
      <div className="basis-1/3 flex justify-center">
        <RollingAvatar
          currentSrc={currentAvatarUrl || defaultAvatar}
          prevSrc={prevAvatarUrl || defaultAvatar}
          isSliding={isSliding}
          defaultAvatar={defaultAvatar}
          size={180}
        />
      </div>
      <div className="basis-2/3 pl-4">
        <div
          key={`name-${currentIndex}`}
          className="text-2xl font-bold mb-2 speaker-fade"
        >
          {currentSpeaker?.name}
        </div>
        <div
          key={`company-${currentIndex}`}
          className="text-base font-semibold mb-4 text-[#1E1E1E]/60 speaker-fade"
        >
          {currentSpeaker?.company}
        </div>
        <div className="text-lg font-semibold leading-relaxed line-clamp-3">
          {talk.title}
        </div>
      </div>
      <style jsx>{`
        .speaker-fade {
          animation: speakerFadeIn ${ANIMATION_DURATION_SEC}
            cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes speakerFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
