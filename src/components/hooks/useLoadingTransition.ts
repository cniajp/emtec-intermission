import { useEffect, useState } from 'react'

type UseLoadingTransitionOptions = {
  isDataReady: boolean
  isDataLoading?: boolean
  forceAnimation?: boolean
}

export const useLoadingTransition = ({
  isDataReady,
  isDataLoading = false,
  forceAnimation = false,
}: UseLoadingTransitionOptions) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isLogoFadingOut, setIsLogoFadingOut] = useState(false)

  useEffect(() => {
    if (isDataReady || forceAnimation) {
      // ローディング画面を表示し、ロゴがフェードイン完了後にフェードアウト
      const timer = setTimeout(() => {
        setIsLogoFadingOut(true)
        // ロゴのフェードアウト後にコンテンツを表示
        setTimeout(() => {
          setShowContent(true)
          // その後ローディングを非表示
          setTimeout(() => {
            setIsLoading(false)
          }, 100)
        }, 800) // ロゴのフェードアウト時間
      }, 1500) // ロゴのフェードイン完了後（1.5秒）
      return () => {
        clearTimeout(timer)
      }
    } else if (!isDataLoading) {
      // データがない場合は即座に切り替え
      setIsLoading(false)
      setShowContent(true)
    }
  }, [isDataReady, isDataLoading, forceAnimation])

  return {
    isLoading,
    showContent,
    isLogoFadingOut,
  }
}
