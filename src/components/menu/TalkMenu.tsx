import { useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Talk, Track } from '@/data/types'
import type { MenuView } from '@/logic/models/talkView'
import { getTimeStr } from '@/utils/time'

type Props = {
  view: MenuView
  // トークを開くページのパス。例: (id) => `/break/talks/${id}`
  talkPathname: (talkId: number) => string
  // トラックごとの操作（OBS / Companion のエクスポートボタン）
  renderTrackActions: (track: Track) => ReactNode
}

// PC 幅でトラックがこの数を超えたら、列を詰めずに横スクロールにする
const MAX_TRACKS_WITHOUT_SCROLL = 5
const MIN_TRACK_COLUMN_PX = 200
const TIME_COLUMN = '5.5rem'

/**
 * メニューのタイムテーブル。
 * - PC 幅（md 以上）: 時刻 × 全トラックの表。列の数はトラックの数に合わせる
 * - スマートフォン幅: タブでトラックを選び、そのトラックを時刻順の縦リストで出す
 *
 * このサイトの文字サイズ表（tailwind.css の @theme）は 1920x1080 の配信画面向けに大きいので、
 * 文字サイズは px で直接指定している。
 */
export function TalkMenu({ view, talkPathname, renderTrackActions }: Props) {
  const tracks = view.allTracks
  const slots = view
    .timeSlots()
    .map((slot) => ({ slot, talks: view.getTalksOnTimeSlot(slot) }))
  const [selected, setSelected] = useState(0)
  // 日を切り替えてトラックが減ったときに、範囲外を指さないようにする
  const selectedIndex = selected < tracks.length ? selected : 0
  const selectedTrack = tracks[selectedIndex]

  const columns: CSSProperties = {
    gridTemplateColumns: `${TIME_COLUMN} repeat(${tracks.length}, minmax(0, 1fr))`,
  }
  const tableMinWidth =
    tracks.length > MAX_TRACKS_WITHOUT_SCROLL
      ? `calc(${TIME_COLUMN} + ${tracks.length * MIN_TRACK_COLUMN_PX}px)`
      : undefined

  return (
    <div className="mx-auto max-w-7xl text-[13px] leading-normal text-white">
      {/* PC 幅: 時刻 × 全トラックの表 */}
      <div className="hidden overflow-x-auto md:block">
        <div style={{ minWidth: tableMinWidth }}>
          <div
            className="mb-3 grid gap-px overflow-hidden rounded-lg border border-neutral-700 bg-neutral-700"
            style={columns}
          >
            <div className="flex items-center bg-neutral-800 px-3 py-2 text-[12px] font-medium text-neutral-400">
              Time
            </div>
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex flex-wrap items-center justify-between gap-2 bg-neutral-800 px-3 py-2"
              >
                <span className="text-[14px] font-semibold">{track.name}</span>
                <div className="flex gap-1">{renderTrackActions(track)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {slots.map(({ slot, talks }) => (
              <div
                key={slot.startTime}
                className="grid gap-px overflow-hidden rounded-lg border border-neutral-800 bg-neutral-800"
                style={columns}
              >
                <TimeCell slot={slot} className="py-3" />
                {talks.map((talk, i) =>
                  talk ? (
                    <TalkLink
                      key={talk.id}
                      talk={talk}
                      pathname={talkPathname(talk.id)}
                      className="bg-neutral-900 p-3"
                    />
                  ) : (
                    <div key={`empty-${i}`} className="bg-neutral-900/60" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* スマートフォン幅: トラックを選んで縦リスト */}
      <div className="md:hidden">
        {tracks.length > 1 && (
          <div
            role="tablist"
            aria-label="トラック"
            className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1"
          >
            {tracks.map((track, i) => (
              <button
                key={track.id}
                type="button"
                role="tab"
                aria-selected={i === selectedIndex}
                onClick={() => setSelected(i)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  i === selectedIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {track.name}
              </button>
            ))}
          </div>
        )}

        {selectedTrack && (
          <>
            <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2">
              <span className="text-[14px] font-semibold">
                {selectedTrack.name}
              </span>
              <div className="flex gap-1">
                {renderTrackActions(selectedTrack)}
              </div>
            </div>

            <ul className="space-y-1.5">
              {slots.map(({ slot, talks }) => {
                const talk = talks[selectedIndex]
                // このトラックにトークが無い時間帯は出さない
                if (!talk) return null
                return (
                  <li
                    key={slot.startTime}
                    className="flex overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
                  >
                    <TimeCell
                      slot={slot}
                      className="w-16 shrink-0 border-r border-neutral-800 py-3"
                    />
                    <TalkLink
                      talk={talk}
                      pathname={talkPathname(talk.id)}
                      className="min-w-0 flex-1 p-3"
                    />
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

function TimeCell({
  slot,
  className,
}: {
  slot: { startTime: string; endTime: string }
  className: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-neutral-800/60 px-2 text-center ${className}`}
    >
      <span className="text-[13px] font-semibold tabular-nums text-white">
        {getTimeStr(slot.startTime)}
      </span>
      <span className="text-[11px] tabular-nums text-neutral-500">
        {getTimeStr(slot.endTime)}
      </span>
    </div>
  )
}

function TalkLink({
  talk,
  pathname,
  className,
}: {
  talk: Talk
  pathname: string
  className: string
}) {
  const router = useRouter()
  // 表示時間などの上書き（クエリ）はトークのページにも引き継ぐ
  const query = { ...router.query }
  delete query.confDay

  const speakers = talk.speakers
    .map((s) => s.name)
    .filter((name): name is string => !!name)

  return (
    <Link
      href={{ pathname, query }}
      className={`group block transition-colors hover:bg-neutral-800 ${className}`}
    >
      <div className="mb-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
        <span>#{talk.id}</span>
        {talk.cancelled && (
          <span className="rounded-sm bg-red-500/15 px-1.5 text-red-400">
            中止
          </span>
        )}
      </div>
      <div
        className={`text-[13px] font-medium leading-snug text-white transition-colors group-hover:text-blue-300 ${
          talk.cancelled ? 'line-through opacity-60' : ''
        }`}
      >
        {talk.title}
      </div>
      {speakers.length > 0 && (
        <div className="mt-1 text-[11px] leading-snug text-neutral-400">
          {speakers.join(', ')}
        </div>
      )}
    </Link>
  )
}
