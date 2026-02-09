import { useEffect, useState } from 'react'

// アニメーション関連の定数
export const AVATAR_CHANGE_INTERVAL = 3000 // スライド間隔（ms）
export const ANIMATION_DURATION = 1200 // アニメーション時間（ms）
export const ANIMATION_DURATION_SEC = '1.2s' // CSS用

type UseAvatarSliderResult = {
  currentIndex: number
  prevIndex: number
  isSliding: boolean
}

/**
 * アバター画像のスライドアニメーションを管理するカスタムフック
 * @param itemCount - スライドするアイテムの数
 * @param interval - スライド間隔（ms）デフォルト: 3000
 * @param duration - アニメーション時間（ms）デフォルト: 800
 */
export function useAvatarSlider(
  itemCount: number,
  interval = AVATAR_CHANGE_INTERVAL,
  duration = ANIMATION_DURATION
): UseAvatarSliderResult {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const [isSliding, setIsSliding] = useState(false)

  useEffect(() => {
    if (itemCount <= 1) return

    const intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % itemCount
      setPrevIndex(currentIndex)
      setCurrentIndex(nextIndex)
      setIsSliding(true)

      // アニメーション完了後にフラグをリセット
      setTimeout(() => {
        setIsSliding(false)
      }, duration)
    }, interval)

    return () => clearInterval(intervalId)
  }, [itemCount, currentIndex, interval, duration])

  return { currentIndex, prevIndex, isSliding }
}
