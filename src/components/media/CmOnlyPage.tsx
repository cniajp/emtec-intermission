import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { extendConfig } from '@/config'
import type { Track } from '@/data/types'
import { buildPage3Images } from '@/staticConfig'
import { getBrand } from '@/brand/registry'
import { BrandProvider, useBrand } from '@/brand/BrandProvider'
import type { BrandName } from '@/brand/types'
import { makeTrackOnlyView } from '@/logic/models/trackOnlyView'
import { PageCtx, PageCtxProvider } from '@/logic/page-flow/PageContext'
import { selectTheme } from '@/themes/registry'
import { ThemeProvider } from '@/themes/ThemeProvider'
import { Page3ImagePreLoader } from '@/themes/default'
import AudioPlayer from '@/components/media/AudioPlayer'
import DebugBar from '@/components/common/DebugBar'
import Page3 from '@/components/pages/Page3'
import Page4 from '@/components/pages/Page4'
import { useVideoPrecache } from '@/components/hooks/useVideoPrecache'
import { useAssetsReady } from '@/components/hooks/useAssetsReady'
import { PageRunningCtx } from '@/logic/page-flow/PageRunningContext'

type Props = {
  brandName: BrandName
  // 既知のトラック一覧（静的データ版）。?trackName= と一致すればハッシュタグなどを引き継ぐ
  tracks?: ReadonlyArray<Track>
}

const subscribeNothing = () => () => {}

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v

function Pages({
  tracks,
  isReady,
}: Pick<Props, 'tracks'> & { isReady: boolean }) {
  const router = useRouter()
  const brand = useBrand()
  const {
    current,
    setTotalPage,
    goNextPage,
    isNextVideoAvailable,
    invokeNextVideo,
    pageEndsAt,
  } = useContext(PageCtx)

  const trackName = first(router.query.trackName)
  const trackIdParam = Number(first(router.query.trackId))
  const trackId = Number.isFinite(trackIdParam) ? trackIdParam : undefined
  // トーク情報は持たず、ヘッダー用のトラック名だけを持つ view
  const view = useMemo(
    () => makeTrackOnlyView({ trackName, trackId, tracks }),
    [trackName, trackId, tracks]
  )

  const { playlist } = brand.page4
  const videoUrls = useMemo(
    () => playlist.flatMap((item) => item.sources.map((s) => s.src)),
    [playlist]
  )
  // 2周目以降をキャッシュから再生できるよう、未キャッシュ分を保存しておく
  useVideoPrecache(videoUrls)

  const pages = [
    { name: 'Page3', component: <Page3 key={3} view={view} /> },
    { name: 'Page4', component: <Page4 key={4} /> },
  ]
  useEffect(() => {
    setTotalPage(pages.length)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hasCm = playlist.length > 0
  const hasSlides =
    buildPage3Images(
      brand.page3.images,
      brand.page3.trackImages[view.selectedTalk.trackId]
    ).length > 0

  // 背景・ヘッダーロゴ・最初のスライドとフォントの準備が終わるまで透明のまま待ち、
  // そろったらすぐ出す（talk ページのようなフェードインは入れない。ローディング画面が無いぶん、
  // フェードの 1.2 秒がそのまま待ち時間になる）。その間は Page3 の表示時間を進めない
  const stageRef = useRef<HTMLDivElement>(null)
  const isAssetsReady = useAssetsReady(stageRef, isReady)
  const showContent = isReady && isAssetsReady

  const {
    backgroundSrc,
    headerLogoSrc,
    audioSrcs,
    audioShuffle,
    audioFadeSeconds,
    audioFadeOutBeforeCm,
  } = brand.base
  // BGM は Page3 の間だけ流す。Page3 が無いと Page4 の合間に一瞬だけ Page3 を通るので流さない
  const isCm = pages[current].name === 'Page4'
  const shouldPlayAudio = showContent && hasSlides && !(hasCm && isCm)
  const fadeOutBeforeCmAt =
    audioFadeOutBeforeCm && hasCm && !isCm ? pageEndsAt : null

  // 両方とも空だと、互いにスキップし合って止まらない
  if (!hasCm && !hasSlides) {
    return (
      <div className="w-[1920px] h-[1080px] flex items-center justify-center bg-black text-white text-xl">
        表示するものがありません（page3.images と page4.playlist が空です）
      </div>
    )
  }

  // クエリが読める前（サーバーが返す HTML の時点）でも分かる、共通の1枚目
  const firstSlide = brand.page3.images[0]

  return (
    <>
      <Head>
        {/* ページ本体はクエリを読んでから描画するので、HTML の時点で取得を始めておく
            （背景は priority で先読み済み） */}
        <link rel="preload" as="image" href={headerLogoSrc} />
        {firstSlide && (
          <link
            rel="preload"
            as="image"
            href={`/${brand.page3.alias}/${firstSlide}`}
          />
        )}
      </Head>
      <div>
        <link rel="stylesheet" href="https://use.typekit.net/egz6rzg.css" />
      </div>
      <DebugBar
        onBackToMenu={() => router.push('/')}
        onUpdateCache={() => {
          navigator.serviceWorker?.controller?.postMessage({
            type: 'UPDATE_CACHE',
            urls: videoUrls,
          })
        }}
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
      {/* 2枚目以降の先読みは、最初の表示が始まってから。先に始めると1枚目と帯域を取り合う */}
      {showContent && <Page3ImagePreLoader view={view} />}
      <div
        ref={stageRef}
        className="w-[1920px] h-[1080px] relative text-black overflow-hidden"
      >
        <Image
          src={backgroundSrc}
          alt="background"
          className="-z-10"
          fill
          style={{ objectFit: 'cover' }}
          priority
          // talk ページと同じく元ファイルをそのまま配信する（Service Worker のプリキャッシュが効く）
          unoptimized
        />
        {isReady && (
          <PageRunningCtx.Provider value={showContent}>
            <div
              className={`absolute inset-0 ${showContent ? '' : 'opacity-0'}`}
            >
              {pages[current].component}
            </div>
          </PageRunningCtx.Provider>
        )}
      </div>
    </>
  )
}

/**
 * セッション情報を出さずに、Page3（告知スライド）と Page4（CM）だけを繰り返し流すページ。
 * /break/cm と /break-dk/cm の中身。
 *
 * 表示内容は staticConfig と URL のクエリだけで決まる。データソース（Dreamkast API のフックを
 * 含む）は読み込まないので、/break-dk/cm も API は呼ばない。
 *
 * クエリ:
 * - trackName: ヘッダーに出すトラック名
 * - trackId:   トラック別の Page3 画像（page3.trackImages）を使うときの ID
 */
export default function CmOnlyPage({ brandName, tracks }: Props) {
  const router = useRouter()
  const theme = selectTheme(first(router.query.theme))

  // サーバー描画とハイドレーション時は false にそろえる（router.isReady はクエリ無しだと
  // ブラウザ側だけ最初から true になり、ハイドレーションがずれる）
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  )
  // クエリが読めてから中身の表示を始める（trackName が後から入るとヘッダーが一度空で出る。
  // debug も、VideoPlaylist がマウント時の config.debug でコントロールの有無を決める）。
  // 同じクエリなら何度呼んでも結果は同じなので、子より先に効くよう描画中に反映する
  const isReady = isClient && router.isReady
  if (isReady) {
    extendConfig(router.query as Record<string, string>)
  }
  return (
    <BrandProvider brand={getBrand(brandName)}>
      <ThemeProvider theme={theme}>
        <PageCtxProvider>
          <Pages tracks={tracks} isReady={isReady} />
        </PageCtxProvider>
      </ThemeProvider>
    </BrandProvider>
  )
}
