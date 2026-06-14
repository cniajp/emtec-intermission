import { useEffect, useRef, useState } from 'react'
import { staticConfig } from '@/staticConfig'
import { Speaker } from '@/data/types'

const DEFAULT_AVATAR = (isDk: boolean) =>
  isDk
    ? staticConfig.breakDk.base.defaultAvatarSrc
    : staticConfig.break.base.defaultAvatarSrc

export function SpeakerCards({
  speakers,
  isDk,
}: {
  speakers: Speaker[]
  isDk: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOverflow, setIsOverflow] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (container && content) {
      setIsOverflow(content.scrollWidth > container.clientWidth)
    }
  }, [speakers])

  if (speakers.length === 0) return null

  const cardElements = speakers.map((s, i) => (
    <div
      key={i}
      className="shrink-0 mx-4 flex flex-col items-center min-w-[140px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.avatarUrl || DEFAULT_AVATAR(isDk)}
        alt={s.name}
        className="rounded-full object-cover border-4 border-white/40 shadow-xl mb-3 bg-white"
        style={{ width: 100, height: 100 }}
        onError={(e) => {
          e.currentTarget.src = DEFAULT_AVATAR(isDk)
        }}
      />
      <div className="text-white text-lg font-bold text-center leading-tight">
        {s.name}
      </div>
      {s.company && (
        <div className="text-white/80 text-sm text-center mt-1 leading-tight">
          {s.company}
        </div>
      )}
    </div>
  ))

  return (
    <div ref={containerRef} className="overflow-hidden w-full py-4">
      <div
        ref={contentRef}
        className={`flex ${isOverflow ? '' : 'justify-center'}`}
        style={
          isOverflow
            ? {
                animation: 'sushiLane 25s linear infinite',
                width: 'max-content',
              }
            : undefined
        }
      >
        {cardElements}
        {isOverflow && cardElements}
        {isOverflow && cardElements}
      </div>
      {isOverflow && (
        <style jsx>{`
          @keyframes sushiLane {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.33%);
            }
          }
        `}</style>
      )}
    </div>
  )
}
