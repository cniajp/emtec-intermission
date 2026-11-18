import { useMemo, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/router'
import { extendConfig } from '@/config'
import { getBrand } from '@/brand/registry'
import { BrandProvider, useBrand } from '@/brand/BrandProvider'
import type { BrandName } from '@/brand/types'
import { selectTheme } from '@/themes/registry'
import { ThemeProvider, useTheme } from '@/themes/ThemeProvider'
import { useVideoPrecache } from '@/components/hooks/useVideoPrecache'

const subscribeNothing = () => () => {}

function CmOnly() {
  const router = useRouter()
  const brand = useBrand()
  const { Page4: Presenter } = useTheme()
  const { playlist } = brand.page4

  // debug=true などのクエリを反映してから再生を始める
  // （VideoPlaylist はマウント時の config.debug でコントロールの有無を決める）。
  // 同じクエリなら何度呼んでも結果は同じなので、子より先に効くよう描画中に反映する
  // サーバー描画とハイドレーション時は false にそろえる（router.isReady はクエリ無しだと
  // ブラウザ側だけ最初から true になり、ハイドレーションがずれる）
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  )
  const isReady = isClient && router.isReady
  if (isReady) {
    extendConfig(router.query as Record<string, string>)
  }

  // 最後の動画が終わるたびに増やし、プレイヤーを作り直して先頭から流し直す
  const [round, setRound] = useState(0)

  return (
    <div className="w-[1920px] h-[1080px] relative overflow-hidden bg-black">
      {playlist.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-white text-[32px]">
          CM 動画が設定されていません（page4.playlist が空です）
        </div>
      ) : (
        isReady && (
          <Presenter
            key={round}
            playlist={playlist}
            onEnded={() => setRound((n) => n + 1)}
          />
        )
      )}
    </div>
  )
}

/**
 * CM（page4.playlist）だけを繰り返し流すページ。BGM・セッション情報は出さない。
 * /break/cm と /break-dk/cm の中身。
 * 動画の一覧は staticConfig だけで決まるので、/break-dk/cm も Dreamkast API は呼ばない。
 */
export default function CmOnlyPage({ brandName }: { brandName: BrandName }) {
  const router = useRouter()
  const theme = selectTheme(router.query.theme as string | undefined)
  const brand = getBrand(brandName)
  // 2周目以降をキャッシュから再生できるよう、未キャッシュ分を保存しておく。
  // URL は brand（staticConfig）から直接取る。データソース（Dreamkast API のフックを含む）は読み込まない
  const videoUrls = useMemo(
    () =>
      brand.page4.playlist.flatMap((item) => item.sources.map((s) => s.src)),
    [brand]
  )
  useVideoPrecache(videoUrls)
  return (
    <BrandProvider brand={brand}>
      <ThemeProvider theme={theme}>
        <CmOnly />
      </ThemeProvider>
    </BrandProvider>
  )
}
