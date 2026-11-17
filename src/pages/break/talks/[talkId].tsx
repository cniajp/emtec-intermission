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
import { useContext, useEffect, useRef } from 'react'
import { useAssetsReady } from '@/components/hooks/useAssetsReady'
import { PageRunningCtx } from '@/logic/page-flow/PageRunningContext'
import Image from 'next/image'
import { useLoadingTransition } from '@/components/hooks/useLoadingTransition'
import { useVideoPrecache } from '@/components/hooks/useVideoPrecache'

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

  // Page4 の CM 動画を、Page1〜3 を表示している裏でキャッシュしておく
  useVideoPrecache(dataSource.videoCacheUrls)

  const {
    current,
    setTotalPage,
    goNextPage,
    isNextVideoAvailable,
    invokeNextVideo,
    pageEndsAt,
  } = useContext(PageCtx)

  const { view } = dataSource.useTalkView(
    typeof talkId === 'string' ? talkId : null
  )

  // 背景・ロゴ・Page1 の画像とフォントの準備が終わるまでローディングを続ける
  const stageRef = useRef<HTMLDivElement>(null)
  const isAssetsReady = useAssetsReady(stageRef, !!view)
  const { isLoading, showContent, isLogoFadingOut } = useLoadingTransition({
    isDataReady: !!view,
    forceAnimation: true,
    isAssetsReady,
  })

  const pages = [
    { name: 'Page1', component: <Page1 key={1} view={view} /> },
    { name: 'Page2', component: <Page2 key={2} view={view} /> },
    { name: 'Page3', component: <Page3 key={3} view={view} /> },
    { name: 'Page4', component: <Page4 key={4} /> },
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
    audioSrcs,
    audioShuffle,
    audioFadeSeconds,
    audioFadeOutBeforeCm,
  } = activeBrand.base

  // CM 動画が無いと Page4 は即スキップされるので、BGM を止めない
  // （止めると Page1 に戻るたびに CM 明けのフェードインが入る）
  const hasCm = activeBrand.page4.playlist.length > 0
  const shouldPlayAudio = !(hasCm && pages[current].name === 'Page4')
  // 次が Page4（CM）なら、今のページの終わりに向けて BGM をフェードアウトする
  const nextPageName = pages[(current + 1) % pages.length].name
  const fadeOutBeforeCmAt =
    audioFadeOutBeforeCm && hasCm && nextPageName === 'Page4'
      ? pageEndsAt
      : null

  return (
    <>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
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
      <AudioPlayer
        srcs={audioSrcs}
        shuffle={audioShuffle}
        fadeSeconds={audioFadeSeconds}
        fadeOutAt={fadeOutBeforeCmAt}
        shouldPlay={shouldPlayAudio}
      />
      <AvatarPreLoader view={view} />
      <Page3ImagePreLoader view={view} />
      <div ref={stageRef} className="w-[1920px] h-[1080px] relative">
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
          // ローディング中はページの表示時間を進めない
          <PageRunningCtx.Provider value={showContent}>
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
            {/* コンテンツ。データが揃ったらローディングの裏で透明のままマウントし、
                レイアウト計算と画像・フォントの読み込みを先に済ませてからフェードインする。
                同じ要素のクラスだけを切り替える（作り直すと計算をやり直すことになる） */}
            {(showContent || !!view) && (
              <div
                className={`absolute inset-0 ${showContent ? classes.contentFadeIn : 'opacity-0'}`}
              >
                {pages[current].component}
              </div>
            )}
          </PageRunningCtx.Provider>
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
