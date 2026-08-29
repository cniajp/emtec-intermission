import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

export default defineCloudflareConfig({
  // `/serwist/sw.js` は `force-static` の Route Handler としてビルド時に生成される。
  // インクリメンタルキャッシュを設定しないと Worker 側がその生成結果を読めず、
  // リクエストのたびに Route Handler を実行してしまう。ハンドラは esbuild で
  // Service Worker をバンドルするので Workers 上では動かず 500 になる。
  // このアプリは再検証を行わない（revalidate: false）ので、ビルド成果物を
  // 静的アセットから読むだけの読み取り専用キャッシュで十分。
  incrementalCache: staticAssetsIncrementalCache,
})
