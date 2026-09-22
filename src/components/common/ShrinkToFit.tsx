import { ReactNode, useLayoutEffect, useRef } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** 縮小の下限 (px) */
  minFontSize?: number
  /** 1 回あたりの縮小幅 (px) */
  step?: number
  /** この値が変わったら再計測する（表示テキストなど） */
  resetKey?: unknown
}

/**
 * 親要素のコンテンツ領域（padding を除いた高さ）に収まるまで、
 * 自身の font-size を段階的に小さくする。テキストを切り捨てない代わりに縮める用途。
 * line-height は Tailwind の text-* が単位なし比率で設定するため、font-size に追従する。
 */
export function ShrinkToFit({
  children,
  className,
  minFontSize = 16,
  step = 2,
  resetKey,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return

    const fit = () => {
      const cs = getComputedStyle(parent)
      const available =
        parent.clientHeight -
        parseFloat(cs.paddingTop) -
        parseFloat(cs.paddingBottom)
      el.style.fontSize = ''
      let size = parseFloat(getComputedStyle(el).fontSize)
      while (el.scrollHeight > available && size - step >= minFontSize) {
        size -= step
        el.style.fontSize = `${size}px`
      }
    }

    fit()

    // Web フォント（Adobe Fonts）が後から適用されると字幅が変わる。
    // このプロジェクトは line-height が固定 px なので要素の高さは変わらず、
    // ResizeObserver では検知できない。fonts.ready と loadingdone の両方で再計測する。
    let cancelled = false
    const fonts = document.fonts
    fonts?.ready.then(() => {
      if (!cancelled) fit()
    })
    const onFontsLoaded = () => fit()
    fonts?.addEventListener('loadingdone', onFontsLoaded)

    // 子要素の内容が後から変わる（PhraseText の <wbr> 挿入など）と折り返しが変わるので、
    // DOM の変更を監視して再計測する。fit() は冪等なのでループしない。
    const observer = new MutationObserver(() => fit())
    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      cancelled = true
      fonts?.removeEventListener('loadingdone', onFontsLoaded)
      observer.disconnect()
    }
  }, [resetKey, minFontSize, step])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
