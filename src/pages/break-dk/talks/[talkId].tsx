import AudioPlayer from '@/components/media/AudioPlayer'
import Page1 from '@/components/pages/Page1'
import Page2, { AvatarPreLoader } from '@/components/pages/Page2'
import Page3 from '@/components/pages/Page3'
import Page4 from '@/components/pages/Page4'
import Loading from '@/components/common/Loading'
import DebugBar from '@/components/common/DebugBar'
import {
  useGetEvent,
  useGetTalksAndTracks,
} from '@/components/hooks/useGetTalksAndTracks'
import { PageCtx, PageCtxProvider } from '@/components/models/pageContext'
import config, { extendConfig } from '@/config'
import { staticConfig } from '@/staticConfig'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useLoadingTransition } from '@/components/hooks/useLoadingTransition'
import { stat } from 'fs'

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

  const {
    current,
    setTotalPage,
    goNextPage,
    isNextVideoAvailable,
    invokeNextVideo,
  } = useContext(PageCtx)
  const { isLoading: isDataLoading, view } = useGetTalksAndTracks(
    talkId as string | null
  )
  const eventResult = useGetEvent(config.dkEventAbbr)
  const backToMenuDayNum = useMemo(() => {
    const apiDayId = view?.selectedTalk.conferenceDayId
    const days = eventResult.data?.conferenceDays
    if (!apiDayId || !days) return 1
    const idx = days.findIndex((d) => d.id === apiDayId)
    return idx >= 0 ? idx + 1 : 1
  }, [view, eventResult.data])

  const { isLoading, showContent, isLogoFadingOut } = useLoadingTransition({
    isDataReady: !!view,
    isDataLoading,
  })

  const pages = [
    { name: 'Page1', component: <Page1 key={1} view={view} isDk={true} /> },
    { name: 'Page2', component: <Page2 key={2} view={view} isDk={true} /> },
    { name: 'Page3', component: <Page3 key={3} view={view} isDk={true} /> },
    { name: 'Page4', component: <Page4 key={4} view={view} isDk={true} /> },
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
  // CM ありの場合
  const shouldPlayAudio = pages[current].name !== 'Page4'

  const { loadingIconSrc, backgroundSrc, audioSrc } = staticConfig.breakDk.base

  return (
    <>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
        <link
          rel="preload"
          as="image"
          href="/cnk2026/background.jpg"
        />
      </div>
      <DebugBar
        onBackToMenu={() => {
          router.push(`/break-dk/menu/${backToMenuDayNum}`)
        }}
        onUpdateCache={updateCache}
        onGoNext={goNextPage}
        onNextVideo={isNextVideoAvailable ? invokeNextVideo : null}
      />
      <AudioPlayer src={audioSrc} shouldPlay={shouldPlayAudio} />
      <AvatarPreLoader view={view} isDk={true}></AvatarPreLoader>
      <div className="w-[1920px] h-[1080px] relative text-black overflow-hidden">
        <Image
          src={backgroundSrc}
          alt="background"
          className="-z-10"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute -z-8 left-[1476px] top-[834px] w-[994px] h-[994px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/cnk2026/new/layer-1.png"
            alt="background"
            className="spin-slow-cw"
            width={994}
            height={994}
            priority
          />
        </div>
        <div className="absolute -z-6 left-[388px] top-[675px] w-[529px] h-[458px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/cnk2026/new/layer-2.png"
            alt="background"
            className="spin-slow-ccw"
            width={529}
            height={458}
            priority
          />
        </div>
        <Image
          src="/cnk2026/new/layer-3.png"
          alt="background"
          className="-z-4"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* ローディング画面 */}
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Loading isFadingOut={isLogoFadingOut} logoPath={loadingIconSrc} />
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
