import type { CSSProperties } from 'react'

type Props = {
  // 表の列数（トラック数）。まだ分からないときは省略
  trackCount?: number
}

const ROWS = 6
const BAR = 'rounded-sm bg-neutral-700/70'

/**
 * データが届くまで TalkMenu の代わりに出す骨組み。
 * 届いたあとに位置がずれないよう、TalkMenu と同じ枠・余白にしている。
 */
export function TalkMenuSkeleton({ trackCount = 4 }: Props) {
  const columns: CSSProperties = {
    gridTemplateColumns: `5.5rem repeat(${trackCount}, minmax(0, 1fr))`,
  }
  return (
    <div
      className="mx-auto max-w-7xl animate-pulse"
      role="status"
      aria-label="読み込み中"
    >
      {/* PC 幅 */}
      <div className="hidden md:block">
        <div
          className="mb-3 grid gap-px overflow-hidden rounded-lg border border-neutral-700 bg-neutral-700"
          style={columns}
        >
          {Array.from({ length: trackCount + 1 }, (_, i) => (
            <div key={i} className="bg-neutral-800 px-3 py-2">
              <div className={`${BAR} h-[21px] w-16`} />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {Array.from({ length: ROWS }, (_, row) => (
            <div
              key={row}
              className="grid gap-px overflow-hidden rounded-lg border border-neutral-800 bg-neutral-800"
              style={columns}
            >
              <div className="flex flex-col items-center justify-center gap-1.5 bg-neutral-800/60 py-3">
                <div className={`${BAR} h-3 w-10`} />
                <div className={`${BAR} h-2.5 w-8`} />
              </div>
              {Array.from({ length: trackCount }, (_, i) => (
                <div key={i} className="space-y-2 bg-neutral-900 p-3">
                  <div className={`${BAR} h-2.5 w-8`} />
                  <div className={`${BAR} h-3 w-4/5`} />
                  <div className={`${BAR} h-2.5 w-1/3`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* スマートフォン幅 */}
      <div className="md:hidden">
        <div className="mb-3 flex gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-[31px] w-16 rounded-full bg-neutral-800"
            />
          ))}
        </div>
        <div className="mb-3 h-[41px] rounded-lg border border-neutral-700 bg-neutral-800" />
        <div className="space-y-1.5">
          {Array.from({ length: ROWS }, (_, row) => (
            <div
              key={row}
              className="flex overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
            >
              <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-1.5 border-r border-neutral-800 bg-neutral-800/60 py-3">
                <div className={`${BAR} h-3 w-10`} />
                <div className={`${BAR} h-2.5 w-8`} />
              </div>
              <div className="flex-1 space-y-2 p-3">
                <div className={`${BAR} h-2.5 w-8`} />
                <div className={`${BAR} h-3 w-4/5`} />
                <div className={`${BAR} h-2.5 w-1/3`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
