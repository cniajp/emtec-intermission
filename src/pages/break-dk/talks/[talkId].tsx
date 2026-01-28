import AudioPlayer from '@/components/AudioPlayer'
import Page1 from '@/components/Page1'
import Page2, { AvatarPreLoader } from '@/components/Page2'
import Page3 from '@/components/Page3'
import Page4 from '@/components/Page4'
import Loading from '@/components/Loading'
import { useGetTalksAndTracks } from '@/components/hooks/useGetTalksAndTracks'
import { PageCtx, PageCtxProvider } from '@/components/models/pageContext'
import config, { extendConfig } from '@/config'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Image from 'next/image'
import { useLoadingTransition } from '@/components/hooks/useLoadingTransition'

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
  const { isLoading: isDataLoading, view } = useGetTalksAndTracks(
    talkId as string | null
  )

  const { isLoading, showContent, isLogoFadingOut } = useLoadingTransition({
    isDataReady: !!view,
    isDataLoading,
  })

  const pages = [
    { name: 'Page1', component: <Page1 key={1} view={view} isDk={true} /> },
    { name: 'Page2', component: <Page2 key={2} view={view} isDk={true} /> },
    { name: 'Page3', component: <Page3 key={3} view={view} isDk={true} /> },
    { name: 'Page4', component: <Page4 key={4} view={view} /> },
  ]
  useEffect(() => {
    setTotalPage(pages.length)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // デバッグ用: 現在のコンポーネント名をコンソールに出力
  useEffect(() => {
    if (config.debug) {
      console.log(`Current component: ${pages[current].name}`)
    }
  }, [current]) // eslint-disable-line react-hooks/exhaustive-deps

  const audioSrc = '/cnds2025/cnds2025_intermission.mp3'
  // CM ありの場合
  const shouldPlayAudio = pages[current].name !== 'Page4'

  return (
    <>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
      </div>
      {config.debug && (
        <>
          <button
            onClick={() => {
              const dayId = view?.selectedTalk.conferenceDayId || 1
              router.push(`/break-dk/menu/${dayId}`)
            }}
            className="font-bold py-0 px-4 mx-2 my-2 rounded bg-red-300 items-right"
          >
            Back to Menu
          </button>
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
          src="/cndw2024/background.png"
          alt="background"
          className="-z-10"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* ローディング画面 */}
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Loading
              isFadingOut={isLogoFadingOut}
              logoPath="/cndw2025/logo.png"
            />
          </div>
        )}
        {/* コンテンツ */}
        {showContent && (
          <div className="absolute inset-0 content-fade-in">
            {pages[current].component}
          </div>
        )}
        {!isLoading && !showContent && (
          <div className="absolute inset-0">{pages[current].component}</div>
        )}
      </div>
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
