// Turbopack ではビルドプラグインが使えないため、Serwist は Route Handler として
// Service Worker を配信する。出力名は常に `sw.js` なので、登録側の URL は
// `/serwist/sw.js`（`Service-Worker-Allowed: /` が付くのでスコープは `/`）。
// 動的セグメントは `[...path]` ではなく `[path]` である必要がある。
import { createSerwistRoute } from '@serwist/turbopack'

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: 'src/service-worker.js',
    useNativeEsbuild: true,
  })
