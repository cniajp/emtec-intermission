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
  size = 180,
  defaultAvatar,
}: RollingAvatarProps) {
  return (
    <div
      className="rounded-full overflow-hidden relative"
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
            ? `rollIn ${ANIMATION_DURATION_SEC} cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`
            : 'none'};
        }
        @keyframes rollIn {
          0% {
            transform: translateX(-100%) rotate(-90deg);
          }
          100% {
            transform: translateX(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  )
}
