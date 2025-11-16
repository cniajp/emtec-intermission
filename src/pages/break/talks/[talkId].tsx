import AudioPlayer from '@/components/AudioPlayer'
import Page1 from '@/components/Page1'
import Page2, { AvatarPreLoader } from '@/components/Page2'
import Page3 from '@/components/Page3'
import Page4 from '@/components/Page4'
import Loading from '@/components/Loading'
import { PageCtx, PageCtxProvider } from '@/components/models/pageContext'
import { TalkView } from '@/components/models/talkView'
import config, { extendConfig } from '@/config'
import { speakers } from '@/data/speakers'
import { talks } from '@/data/talks'
import { tracks } from '@/data/tracks'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

function updateCache() {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'UPDATE_CACHE' })
  }
}

function Pages() {
  const router = useRouter()
  const { talkId } = router.query
  useEffect(() => {
    extendConfig(router.query as Record<string, string>)
  }, [router.query])

  const { current, setTotalPage, goNextPage } = useContext(PageCtx)
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [isLogoFadingOut, setIsLogoFadingOut] = useState(false)

  const view = useMemo(() => {
    if (!talkId) {
      return null
    }
    return TalkView.withoutDk(talkId as string, talks, tracks, speakers)
  }, [talkId])

  // ローディング状態の管理
  useEffect(() => {
    if (view) {
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
    }
  }, [view])

  const pages = [
    <Page1 key={1} view={view} isDk={false} />,
    <Page2 key={2} view={view} isDk={false} />,
    <Page3 key={3} view={view} isDk={false} />,
    <Page4 key={4} view={view} />,
  ]
  useEffect(() => {
    setTotalPage(pages.length)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const audioSrc = '/pek2025/pek2025_intermission.mp3'

  // const shouldPlayAudio = current !== pages.length // Page4を使用しない場合
  const shouldPlayAudio = current !== pages.length - 1

  return (
    <>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
      </div>
      {config.debug && (
        <>
          <button
            onClick={updateCache}
            className="font-bold py-0 px-4 mx-2 my-2 rounded bg-yellow-300 items-right"
          >
            Update Video Cache
          </button>
          <button
            onClick={goNextPage}
            className="font-bold py-0 px-4 mx-2 my-2 rounded bg-blue-300 items-right"
          >
            Go Next
          </button>
        </>
      )}
      <AudioPlayer src={audioSrc} shouldPlay={shouldPlayAudio} />
      <AvatarPreLoader view={view}></AvatarPreLoader>
      <div className="w-[1920px] h-[1080px] relative">
        <Image
          src="/pek2025/background.webp"
          alt="background"
          className="-z-10"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* ローディング画面 */}
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Loading isFadingOut={isLogoFadingOut} />
          </div>
        )}
        {/* コンテンツ */}
        {showContent && (
          <div className="absolute inset-0 content-fade-in">
            {pages[current]}
          </div>
        )}
        {!isLoading && !showContent && (
          <div className="absolute inset-0">{pages[current]}</div>
        )}
      </div>
      <div className="w-[1280px] h-[300px] bg-black relative"></div>
    </>
  )
}

export default function Index() {
  return (
    <PageCtxProvider>
      <Pages />
    </PageCtxProvider>
  )
}
