import { RefObject, useEffect, useState } from 'react'

// 画像やフォントの取得に失敗・遅延しても、ここで打ち切って表示に進む
export const ASSETS_TIMEOUT_MS = 5000

// container 内の <img> がすべてデコードできる状態になるのを待つ。
// 読み込みに失敗した画像（onError で差し替わるアバターなど）は待たずに進む。
function waitForImages(container: HTMLElement): Promise<unknown> {
  const images = Array.from(container.querySelectorAll('img'))
  return Promise.all(
    images.map((img) =>
      typeof img.decode === 'function' ? img.decode().catch(() => {}) : null
    )
  )
}

// <link rel="stylesheet">（Adobe Fonts）の読み込みが終わるのを待つ。
// @font-face が届く前に document.fonts.ready を見ると、何も待たずに解決してしまう。
function waitForStylesheets(): Promise<unknown> {
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  )
  return Promise.all(
    links.map((link) =>
      link.sheet
        ? null
        : new Promise<void>((resolve) => {
            link.addEventListener('load', () => resolve(), { once: true })
            link.addEventListener('error', () => resolve(), { once: true })
          })
    )
  )
}

async function waitForFonts(container: HTMLElement): Promise<void> {
  await waitForStylesheets()
  if (!document.fonts) return
  // フォントの取得は、その書体を使う文字がレイアウトされたときに始まる。
  // レイアウトを確定させてから ready を待つ（requestAnimationFrame は非表示のタブで
  // 止まるので使わない）。
  void container.offsetHeight
  await document.fonts.ready
}

export function waitForAssets(container: HTMLElement): Promise<unknown> {
  return Promise.all([waitForImages(container), waitForFonts(container)])
}

/**
 * containerRef の中の画像（背景・ロゴ・アバター）とフォントの準備が終わったら true を返す。
 * enabled が true になった時点で container に描画済みのものが対象。
 * timeoutMs を過ぎたら、終わっていなくても true にする。
 */
export function useAssetsReady(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  timeoutMs = ASSETS_TIMEOUT_MS
): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return
    let cancelled = false
    const done = () => {
      if (!cancelled) setReady(true)
    }
    const timer = setTimeout(done, timeoutMs)
    waitForAssets(container).then(done, done)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [containerRef, enabled, timeoutMs])

  return ready
}
