import Link from 'next/link'
import type { UrlObject } from 'url'

type Props = {
  // 例: "JISABA2026 Day 1"
  label: string
  // 例: "11/15(日)"。分からなければ省略
  dateStr?: string
  // 前後の日のメニューへのリンク。無ければ矢印を押せない表示にする
  prevHref?: UrlObject
  nextHref?: UrlObject
}

const ARROW =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors'

function Arrow({
  href,
  label,
  children,
}: {
  href?: UrlObject
  label: string
  children: string
}) {
  if (!href) {
    return (
      <span className={`${ARROW} bg-neutral-800/50 text-neutral-600`}>
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${ARROW} bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white`}
    >
      {children}
    </Link>
  )
}

/** メニューのヘッダーに置く、日付の切り替え */
export function DayNavigation({ label, dateStr, prevHref, nextHref }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Arrow href={prevHref} label="前の日">
        ←
      </Arrow>
      <div className="text-center leading-tight">
        <div className="text-[16px] font-bold text-white">{label}</div>
        {dateStr && (
          <div className="text-[12px] text-neutral-400">{dateStr}</div>
        )}
      </div>
      <Arrow href={nextHref} label="次の日">
        →
      </Arrow>
    </div>
  )
}

// days の中で、current の直前・直後の日を返す
export function adjacentDays(
  days: ReadonlyArray<number>,
  current: number
): { prev?: number; next?: number } {
  const before = days.filter((d) => d < current)
  const after = days.filter((d) => d > current)
  return {
    prev: before.length ? Math.max(...before) : undefined,
    next: after.length ? Math.min(...after) : undefined,
  }
}

// talks に出てくる conferenceDayId（重複なし・昇順）
export function menuDays(
  talks: ReadonlyArray<{ conferenceDayId?: number | null }>
): number[] {
  return [
    ...new Set(
      talks
        .map((talk) => talk.conferenceDayId)
        .filter((id): id is number => id != null)
    ),
  ].sort((a, b) => a - b)
}
