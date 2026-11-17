// Turbopack ではビルドプラグインが使えないため、Serwist は Route Handler として
// Service Worker を配信する。出力名は常に `sw.js` なので、登録側の URL は
// `/serwist/sw.js`（`Service-Worker-Allowed: /` が付くのでスコープは `/`）。
// 動的セグメントは `[...path]` ではなく `[path]` である必要がある。
import { createSerwistRoute } from '@serwist/turbopack'
import { staticConfig, publicDirsOf, isPrecacheTarget } from '@/staticConfig'

// 既定では public/ 配下が全部プリキャッシュされ、過去イベントの画像まで初回表示時に
// ダウンロードされる。src/staticConfig が参照しているイベントのフォルダと、
// イベントに依らない共有フォルダだけに絞る。
// 対象外のファイルは通常どおりネットワークから取得される（表示はできる）。
const SHARED_PUBLIC_DIRS = ['obs-scenes', 'sounds']
const precacheDirs = [
  ...SHARED_PUBLIC_DIRS,
  ...publicDirsOf(Object.values(staticConfig)),
]

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: 'src/service-worker.js',
    useNativeEsbuild: true,
    // 既定の上限は 2MiB で、BGM（1 曲 3〜4MB）が対象から外れて開くたびに取得されていた。
    // 対象フォルダは下の manifestTransforms で絞ってあるので、上限を上げても
    // 増えるのは現行イベントの大きなファイル（BGM）だけ
    maximumFileSizeToCacheInBytes: 16 * 1024 * 1024,
    // この時点の URL はまだ 'public/...' のまま（Serwist 側の書き換えより先に走る）
    manifestTransforms: [
      async (entries) => ({
        manifest: entries.filter((e) => isPrecacheTarget(e.url, precacheDirs)),
        warnings: [],
      }),
    ],
  })
