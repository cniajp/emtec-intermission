import { useEffect, useState } from 'react'

// ロゴのフェードイン（CSS の logo-fade-in）が終わるまでの時間
export const LOGO_FADE_IN_MS = 1500
// ロゴのフェードアウト（CSS の logo-fade-out）の時間
export const LOGO_FADE_OUT_MS = 800

type UseLoadingTransitionOptions = {
  isDataReady: boolean
  isDataLoading?: boolean
  forceAnimation?: boolean
  // 表示に必要な画像・フォントの準備ができたか。データがあるときは、これが true に
  // なるまでローディングを続ける（省略時は待たない）
  isAssetsReady?: boolean
}

export const useLoadingTransition = ({
  isDataReady,
  isDataLoading = false,
  forceAnimation = false,
  isAssetsReady = true,
}: UseLoadingTransitionOptions) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isLogoFadingOut, setIsLogoFadingOut] = useState(false)
  const [isLogoShown, setIsLogoShown] = useState(false)

  const animate = isDataReady || forceAnimation

  useEffect(() => {
    if (animate) {
      // ローディング画面を表示し、ロゴのフェードインが終わるのを待つ
      const timer = setTimeout(() => setIsLogoShown(true), LOGO_FADE_IN_MS)
      return () => clearTimeout(timer)
    } else if (!isDataLoading) {
      // データがない場合は即座に切り替え
      setIsLoading(false)
      setShowContent(true)
    }
  }, [animate, isDataLoading])

  // ロゴを出し終え、かつ（データがあるなら）画像・フォントの準備もできたら、
  // ロゴをフェードアウトさせる。一度始めたら取り消さない
  if (isLogoShown && (!isDataReady || isAssetsReady) && !isLogoFadingOut) {
    setIsLogoFadingOut(true)
  }

  useEffect(() => {
    if (!isLogoFadingOut) return
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    // ロゴのフェードアウト後にコンテンツを表示
    const showTimer = setTimeout(() => {
      setShowContent(true)
      // その後ローディングを非表示
      hideTimer = setTimeout(() => setIsLoading(false), 100)
    }, LOGO_FADE_OUT_MS)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isLogoFadingOut])

  return {
    isLoading,
    showContent,
    isLogoFadingOut,
  }
}
