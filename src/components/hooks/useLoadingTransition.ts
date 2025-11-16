import { useEffect, useState } from 'react'
import config from '@/config'

type UseLoadingTransitionOptions = {
  isDataReady: boolean
  isDataLoading?: boolean
}

export const useLoadingTransition = ({
  isDataReady,
  isDataLoading = false,
}: UseLoadingTransitionOptions) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isLogoFadingOut, setIsLogoFadingOut] = useState(false)

  useEffect(() => {
    if (isDataReady) {
      if (config.debug) {
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
      } else {
        // debugモードでない場合は即座に切り替え
        setIsLoading(false)
        setShowContent(true)
      }
    } else if (!isDataLoading) {
      // データがない場合は即座に切り替え
      setIsLoading(false)
      setShowContent(true)
    }
  }, [isDataReady, isDataLoading])

  return {
    isLoading,
    showContent,
    isLogoFadingOut,
  }
}
