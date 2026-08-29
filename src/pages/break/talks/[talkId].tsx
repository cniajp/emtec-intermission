import AudioPlayer from '@/components/media/AudioPlayer'
import Page1 from '@/components/pages/Page1'
import Page2 from '@/components/pages/Page2'
import Page3 from '@/components/pages/Page3'
import Page4 from '@/components/pages/Page4'
import Loading from '@/components/common/Loading'
import DebugBar from '@/components/common/DebugBar'
import { PageCtx, PageCtxProvider } from '@/logic/page-flow/PageContext'
import { getDataSource } from '@/logic/data/registry'
import { getBrand } from '@/brand/registry'
import { BrandProvider, useBrand } from '@/brand/BrandProvider'
import { selectTheme } from '@/themes/registry'
import { ThemeProvider, useTheme } from '@/themes/ThemeProvider'
import { AvatarPreLoader, Page3ImagePreLoader } from '@/themes/default'
import config, { extendConfig } from '@/config'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Image from 'next/image'
import { useLoadingTransition } from '@/components/hooks/useLoadingTransition'

const dataSource = getDataSource('static')
const brand = getBrand('static')

function updateCache() {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_CACHE',
      urls: dataSource.videoCacheUrls,
    })
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

  const { view } = dataSource.useTalkView(
    typeof talkId === 'string' ? talkId : null
  )

  const { isLoading, showContent, isLogoFadingOut } = useLoadingTransition({
    isDataReady: !!view,
    forceAnimation: true,
  })

  const pages = [
    { name: 'Page1', component: <Page1 key={1} view={view} /> },
    // { name: 'Page2', component: <Page2 key={2} view={view} /> },
    // { name: 'Page3', component: <Page3 key={3} view={view} /> },
    // { name: 'Page4', component: <Page4 key={4} /> },
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

  const activeBrand = useBrand()
  const { classes } = useTheme()
  const {
    loadingIconSrc,
    loadingEnabled,
    loadingLogoShape,
    backgroundSrc,
    audioSrc,
  } = activeBrand.base

  const shouldPlayAudio = pages[current].name !== 'Page4'

  return (
    <>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
        <link rel="preload" as="image" href={backgroundSrc} />
      </div>
      <DebugBar
        onBackToMenu={() => {
          const dayId = view?.selectedTalk.conferenceDayId || 1
          router.push(`${activeBrand.routePrefix}/menu/${dayId}`)
        }}
        onUpdateCache={updateCache}
        onGoNext={goNextPage}
        onNextVideo={isNextVideoAvailable ? invokeNextVideo : null}
      />
      <AudioPlayer src={audioSrc} shouldPlay={shouldPlayAudio} />
      <AvatarPreLoader view={view} />
      <Page3ImagePreLoader view={view} />
      <div className="w-[1920px] h-[1080px] relative">
        <Image
          src={backgroundSrc}
          alt="background"
          className="-z-10"
          fill
          quality={100}
          style={{ objectFit: 'cover' }}
          priority
        />
        {loadingEnabled ? (
          <>
            {/* ローディング画面 */}
            {isLoading && (
              <div className="absolute inset-0 z-10">
                <Loading
                  isFadingOut={isLogoFadingOut}
                  logoPath={loadingIconSrc}
                  logoShape={loadingLogoShape}
                />
              </div>
            )}
            {/* コンテンツ */}
            {showContent && (
              <div className={`absolute inset-0 ${classes.contentFadeIn}`}>
                {pages[current].component}
              </div>
            )}
            {!isLoading && !showContent && (
              <div className="absolute inset-0">{pages[current].component}</div>
            )}
          </>
        ) : (
          <div className="absolute inset-0">{pages[current].component}</div>
        )}
      </div>
    </>
  )
}

export default function Index() {
  const router = useRouter()
  const theme = selectTheme(router.query.theme as string | undefined)
  return (
    <BrandProvider brand={brand}>
      <ThemeProvider theme={theme}>
        <PageCtxProvider>
          <Pages />
        </PageCtxProvider>
      </ThemeProvider>
    </BrandProvider>
  )
}
