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
    // Web フォント（Adobe Fonts）の読み込み後は字幅が変わるので再計測
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) fit()
    })
    return () => {
      cancelled = true
    }
  }, [resetKey, minFontSize, step])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
