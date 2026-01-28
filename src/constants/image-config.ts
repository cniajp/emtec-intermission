// イベントプロジェクト画像の設定

// イベントごとの画像設定
export const EVENT_PROJECT_IMAGES = {
  srekaigi2026: {
    alias: 'srekaigi2026',
    images: [
      'info_001.jpg',
      'info_002.jpg',
      'info_003.jpg',
      'info_004.jpg',
      'info_005.jpg',
    ],
  },
  // 他のイベントを追加する場合はここに記述
  // cnds2025: {
  //   alias: 'cnds2025',
  //   images: [
  //     'info_001.jpg',
  //     'info_002.jpg',
  //   ],
  // },
}

// デフォルトのイベント（環境変数やconfigから動的に選択することも可能）
export const DEFAULT_EVENT = 'srekaigi2026'

// 現在のイベントの画像設定を取得
export function getEventImages(eventKey: string = DEFAULT_EVENT) {
  return (
    EVENT_PROJECT_IMAGES[eventKey as keyof typeof EVENT_PROJECT_IMAGES] ||
    EVENT_PROJECT_IMAGES[DEFAULT_EVENT]
  )
}
