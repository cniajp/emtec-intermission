import type { CSSProperties } from 'react'
import styles from './theme.module.css'

type Direction = 'left' | 'right' | 'up'

const ENTER: Record<Direction, string> = {
  left: styles.enterFromLeft,
  right: styles.enterFromRight,
  up: styles.enterFromBelow,
}

const EXIT: Record<Direction, string> = {
  left: styles.exitToLeft,
  right: styles.exitToRight,
  up: styles.exitToBelow,
}

/**
 * ページ切り替え時の要素の動き。入ってくる向きと同じ側へ出ていく。
 * index が大きい要素ほど少し遅れて動く（theme.module.css の --motion-index）。
 * 返した className と style を、動かしたい要素にそのまま渡す。
 */
export function motion(
  direction: Direction,
  isLeaving: boolean,
  index = 0
): { className: string; style: CSSProperties } {
  return {
    className: isLeaving ? EXIT[direction] : ENTER[direction],
    style: { '--motion-index': index } as CSSProperties,
  }
}
