import { withSerwist } from '@serwist/turbopack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [100],
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
