// 動画設定の一元管理

// VideoPlaylistで使用するプレイリスト形式
export const VIDEO_PLAYLIST = [
  {
    sources: [
      {
        src: 'https://pub-ac15e822806e471884e2b63b26f353c6.r2.dev/srekaigi2026/makuai.mp4',
        type: 'video/mp4',
      },
    ],
  },
  // CM動画 (必要に応じてコメントアウト/アンコメント)
  // {
  //   sources: [
  //     {
  //       src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // },
]

// Service Workerでキャッシュする動画URLのリスト
export const CACHE_VIDEO_URLS = VIDEO_PLAYLIST.flatMap((item) =>
  item.sources.map((source) => source.src)
)

// Service Workerのビデオキャッシュを許可するパス
export const ALLOWED_CACHE_PATHS = ['/break-dk/talks/', '/break/talks/']
