import { withSerwist } from '@serwist/turbopack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [100],
    // 既定の 14400 秒（4 時間）だと、public/ の画像を同名で差し替えても
    // next/image の最適化キャッシュが古いまま返し続ける（dev でも同じ）。
    // 画像は数枚しかないので 60 秒で十分。詳細は docs/image-cache.md
    minimumCacheTTL: 60,
  },

  // Next 16 は `next dev` のたびに CLAUDE.md へ nextjs-agent-rules ブロックを
  // 追記する。CLAUDE.md は手で維持している文書なので自動追記は無効にする。
  // 必要になったら true に戻すか、この行を消せば再び追記される。
  agentRules: false,

  // ホームディレクトリにも package-lock.json があるため、Next がワークスペース
  // ルートを `/Users/<user>` と誤検出して警告を出す。ここを明示して固定する。
  turbopack: {
    root: import.meta.dirname,
  },
}

export default withSerwist(nextConfig)
