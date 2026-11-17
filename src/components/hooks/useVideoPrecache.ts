import { useEffect } from 'react'

// ページを開いた直後はフォント・画像・BGM の読み込みとローディング明けの描画が重なるので、
// 動画のダウンロードはそれが落ち着いてから始める。
// Page4 が始まるのは Page1〜3 の後（1分以上先）なので、数秒遅らせても間に合う。
export const VIDEO_PRECACHE_DELAY_MS = 5000

/**
 * Page4 で再生する動画を Service Worker の video-cache に入れておく。
 * すでにキャッシュ済みの URL は Service Worker 側で読み飛ばすので、ページを開くたびに
 * 呼んでも取り直しにはならない（取り直したいときは debug の「Update Video Cache」ボタン）。
 *
 * Service Worker が無効（開発時）や未対応のブラウザでは何もしない。
 */
export function useVideoPrecache(
  urls: ReadonlyArray<string>,
  delayMs = VIDEO_PRECACHE_DELAY_MS
) {
  // 配列の参照が変わっても中身が同じなら送り直さない
  const key = urls.join('\n')

  useEffect(() => {
    if (!key || !('serviceWorker' in navigator)) return
    let cancelled = false

    const timer = setTimeout(() => {
      // controller ではなく ready を使う。初回インストール直後は Service Worker が
      // まだこのページを制御しておらず controller が null だが、active にはなっていて
      // メッセージは受け取れる（キャッシュした動画が使われるのはリロード後）。
      navigator.serviceWorker.ready
        .then((registration) => {
          if (cancelled) return
          registration.active?.postMessage({
            type: 'UPDATE_CACHE',
            urls: key.split('\n'),
            onlyMissing: true,
          })
        })
        .catch((e) => console.warn('video precache: skip —', e))
    }, delayMs)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [key, delayMs])
}
