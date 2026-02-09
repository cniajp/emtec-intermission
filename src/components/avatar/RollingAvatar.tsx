import { ANIMATION_DURATION_SEC } from '../hooks/useAvatarSlider'

type RollingAvatarProps = {
  currentSrc: string
  prevSrc: string
  isSliding: boolean
  size?: number
  defaultAvatar: string
}

/**
 * 転がりアニメーション付きのアバターコンポーネント
 */
export function RollingAvatar({
  currentSrc,
  prevSrc,
  isSliding,
  size = 200,
  defaultAvatar,
}: RollingAvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden relative border-4 border-white/40 shadow-xl"
      style={{ width: size, height: size }}
    >
      {/* 前の画像（背景として固定表示） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={prevSrc || defaultAvatar}
        alt="avatar-prev"
        className="w-full h-full object-cover absolute inset-0"
        onError={(e) => {
          e.currentTarget.src = defaultAvatar
        }}
      />
      {/* 現在の画像（スライドイン） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc || defaultAvatar}
        alt="avatar"
        className="w-full h-full object-cover absolute inset-0 rounded-full"
        onError={(e) => {
          e.currentTarget.src = defaultAvatar
        }}
      />
      <style jsx>{`
        img:last-of-type {
          animation: ${isSliding
            ? `rollIn ${ANIMATION_DURATION_SEC} cubic-bezier(0.16, 1, 0.3, 1) forwards`
            : 'none'};
        }
        @keyframes rollIn {
          0% {
            transform: translateX(-100%) rotate(-120deg);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
