import { useMemo, useState } from 'react'
import {
  buildCacheTree,
  filterCacheEntries,
  formatBytes,
  summarizeByKind,
  type CacheEntry,
  type CacheTreeNode,
  type CacheTreeSort,
  type FileKind,
} from './cacheTools'

// 種類ごとの表示名と色。Tailwind がクラスを拾えるよう、クラス名は省略せずに書く
const KINDS: Record<FileKind, { label: string; text: string; bg: string }> = {
  image: { label: '画像', text: 'text-emerald-400', bg: 'bg-emerald-400' },
  audio: { label: '音声', text: 'text-amber-400', bg: 'bg-amber-400' },
  video: { label: '動画', text: 'text-rose-400', bg: 'bg-rose-400' },
  script: { label: 'JS', text: 'text-yellow-300', bg: 'bg-yellow-300' },
  style: { label: 'CSS', text: 'text-sky-400', bg: 'bg-sky-400' },
  font: { label: 'フォント', text: 'text-violet-400', bg: 'bg-violet-400' },
  data: { label: 'データ', text: 'text-teal-300', bg: 'bg-teal-300' },
  page: { label: 'ページ', text: 'text-blue-300', bg: 'bg-blue-300' },
  other: { label: 'その他', text: 'text-neutral-400', bg: 'bg-neutral-400' },
}

// 24x24 の線画アイコン（stroke）の path
const ICON_PATHS: Record<FileKind | 'folder' | 'folderOpen' | 'cache', string> =
  {
    folder:
      'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    folderOpen:
      'M3 9V7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2M3 9h18l-2 9a2 2 0 0 1-2 1H6a2 2 0 0 1-2-1z',
    cache:
      'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9.5a1 1 0 1 0 0-.01',
    audio:
      'M9 18V6l10-2v12M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm10-2a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z',
    video: 'M4 5h16v14H4zM10 9l5 3-5 3z',
    script: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
    style: 'M7 4h10M7 20h10M9 4c-3 4-3 12 0 16M15 4c3 4 3 12 0 16',
    font: 'M5 19L12 5l7 14M8 14h8',
    data: 'M8 4c-2 0-2 2-2 4s0 4-2 4c2 0 2 2 2 4s0 4 2 4M16 4c2 0 2 2 2 4s0 4 2 4c-2 0-2 2-2 4s0 4-2 4',
    page: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
    other: 'M6 3h8l4 4v14H6zM14 3v4h4',
  }

function Icon({
  name,
  className,
}: {
  name: keyof typeof ICON_PATHS
  className: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block h-[1.25em] w-[1.25em] shrink-0 align-[-0.25em] ${className}`}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}

type Props = {
  // 全キャッシュの中身。読み込み前は null
  entries: CacheEntry[] | null
  isLoading: boolean
  onRefresh: () => void
}

const TOOL_BUTTON =
  'rounded-sm bg-neutral-700 px-2.5 py-1 hover:bg-neutral-600 transition-colors disabled:opacity-50'

/**
 * 保存されているファイルのツリー。
 * 種類別の内訳、絞り込み、並び替え、開閉をこの中で持つ。
 */
export function CacheTree({ entries, isLoading, onRefresh }: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<CacheTreeSort>('name')
  // すべて開く / 閉じるを押すたびに version を進め、ツリーを作り直して開閉を揃える
  const [expand, setExpand] = useState({ all: false, version: 0 })

  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const filtered = useMemo(
    () => (entries ? filterCacheEntries(entries, query, origin) : null),
    [entries, query, origin]
  )
  const tree = useMemo(
    () => (filtered ? buildCacheTree(filtered, origin, sort) : null),
    [filtered, origin, sort]
  )
  const kinds = useMemo(
    () => (filtered ? summarizeByKind(filtered, origin) : []),
    [filtered, origin]
  )

  const totalBytes = tree?.reduce((n, c) => n + c.bytes, 0) ?? 0
  const totalCount = tree?.reduce((n, c) => n + c.fileCount, 0) ?? 0
  const isFiltering = query.trim() !== ''
  // 絞り込み中は、見つかったファイルが見えるように全部開く
  const openAll = expand.all || isFiltering

  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-[17px] font-semibold">
          保存されているファイル
          {tree && (
            <span className="ml-3 text-[13px] font-normal text-neutral-400">
              {totalCount} 件 / {formatBytes(totalBytes)}
              {isFiltering && entries && `（全 ${entries.length} 件中）`}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-sm bg-neutral-700 px-3 py-1 text-[13px] hover:bg-neutral-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? '読み込み中...' : '更新'}
        </button>
      </div>

      {/* 件数が多いので、ここだけ文字を小さくする（px 指定。このサイトは rem の基準が大きい） */}
      <div className="rounded-lg border border-neutral-700 text-[11px] leading-[1.6] sm:text-[12px]">
        {/* 種類別の内訳 */}
        {kinds.length > 0 && (
          <div className="border-b border-neutral-700 px-2 py-2 sm:px-4 sm:py-3">
            <div
              className="flex h-2 overflow-hidden rounded-full bg-neutral-800"
              role="img"
              aria-label="種類別の内訳"
            >
              {kinds.map((k) => (
                <div
                  key={k.kind}
                  className={KINDS[k.kind].bg}
                  style={{
                    width: `${totalBytes ? (k.bytes / totalBytes) * 100 : 0}%`,
                  }}
                />
              ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {kinds.map((k) => (
                <li key={k.kind} className="flex items-center gap-1.5">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${KINDS[k.kind].bg}`}
                  />
                  <span>{KINDS[k.kind].label}</span>
                  <span className="text-neutral-400">
                    {formatBytes(k.bytes)}（{k.count} 件）
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 絞り込み・並び替え・開閉 */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-700 px-2 py-2 sm:px-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="名前で絞り込み"
            aria-label="名前で絞り込み"
            className="min-w-0 flex-1 basis-40 rounded-sm border border-neutral-700 bg-neutral-800 px-2 py-1 placeholder:text-neutral-500 focus:border-blue-500 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={() => setSort(sort === 'name' ? 'size' : 'name')}
            className={TOOL_BUTTON}
          >
            並び: {sort === 'name' ? '名前順' : 'サイズ順'}
          </button>
          <button
            type="button"
            onClick={() =>
              setExpand((e) => ({ all: true, version: e.version + 1 }))
            }
            className={TOOL_BUTTON}
          >
            すべて開く
          </button>
          <button
            type="button"
            onClick={() =>
              setExpand((e) => ({ all: false, version: e.version + 1 }))
            }
            className={TOOL_BUTTON}
          >
            すべて閉じる
          </button>
        </div>

        <div className="px-2 py-2 font-mono sm:px-4 sm:py-3">
          {!tree && '読み込み中...'}
          {tree && tree.length === 0 && (
            <span className="text-neutral-400">
              {isFiltering
                ? '一致するファイルはありません。'
                : 'キャッシュはありません。'}
            </span>
          )}
          {tree?.map((node) => (
            <TreeNode
              // 開閉を揃え直すときは作り直す
              key={`${expand.version}:${openAll}:${sort}:${node.name}`}
              node={node}
              siblingMax={Math.max(...tree.map((n) => n.bytes))}
              // 最初はキャッシュ名の階層だけ開いておく
              defaultOpen
              openAll={openAll}
              isCache
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function nodeSize(node: CacheTreeNode): string {
  if (node.children === null) {
    return node.hasUnknownSize ? '-' : formatBytes(node.bytes)
  }
  // 配下にサイズ不明のファイルがあるフォルダは、分かっている分の合計に「+」を付ける
  return formatBytes(node.bytes) + (node.hasUnknownSize ? ' +' : '')
}

// 同じ階層の中でいちばん大きいものを 100% とした棒
function SizeBar({
  bytes,
  max,
  className,
}: {
  bytes: number
  max: number
  className: string
}) {
  return (
    <span className="h-1.5 w-10 shrink-0 self-center overflow-hidden rounded-full bg-neutral-800 sm:w-24">
      <span
        className={`block h-full rounded-full ${className}`}
        style={{ width: `${max > 0 ? Math.max((bytes / max) * 100, 2) : 0}%` }}
      />
    </span>
  )
}

function TreeNode({
  node,
  siblingMax,
  defaultOpen = false,
  openAll,
  isCache = false,
}: {
  node: CacheTreeNode
  // 同じ階層でいちばん大きいもののサイズ（棒の長さの基準）
  siblingMax: number
  defaultOpen?: boolean
  openAll: boolean
  // 最上位（キャッシュ名）か。フォルダではないので末尾に "/" を付けない
  isCache?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen || openAll)

  if (node.children === null) {
    const kind = node.kind ?? 'other'
    return (
      <div className="flex items-center gap-2 rounded-sm py-0.5 pl-[1.4em] hover:bg-neutral-800 sm:gap-3">
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          {kind === 'image' && node.url ? (
            // キャッシュ済みの画像そのものを小さく出す（開いたフォルダの分だけ読み込まれる）
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={node.url}
              alt=""
              loading="lazy"
              className="h-[1.5em] w-[1.5em] shrink-0 rounded-[3px] bg-neutral-700 object-cover"
            />
          ) : (
            <Icon name={kind} className={KINDS[kind].text} />
          )}
          <span className="min-w-0 break-all">{node.name}</span>
        </span>
        <SizeBar
          bytes={node.bytes}
          max={siblingMax}
          className={KINDS[kind].bg}
        />
        <span className="w-[5.5em] shrink-0 text-right text-neutral-400">
          {nodeSize(node)}
        </span>
      </div>
    )
  }

  const childMax = Math.max(0, ...node.children.map((c) => c.bytes))
  return (
    <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm py-0.5 hover:bg-neutral-800 sm:gap-3 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            className={`inline-block w-[0.9em] shrink-0 text-center text-neutral-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          >
            ▸
          </span>
          <Icon
            name={isCache ? 'cache' : isOpen ? 'folderOpen' : 'folder'}
            className={isCache ? 'text-blue-300' : 'text-neutral-300'}
          />
          <span className="min-w-0 break-all font-semibold">
            {node.name}
            {!isCache && '/'}
          </span>
          <span className="shrink-0 rounded-full bg-neutral-800 px-1.5 text-[0.9em] text-neutral-400">
            {node.fileCount}
          </span>
        </span>
        <SizeBar
          bytes={node.bytes}
          max={siblingMax}
          className="bg-neutral-400"
        />
        <span className="w-[5.5em] shrink-0 text-right text-neutral-300">
          {nodeSize(node)}
        </span>
      </summary>
      {/* 閉じているフォルダの中身は描画しない（画像の読み込みも起きない） */}
      {isOpen && (
        <div className="ml-[0.45em] border-l border-neutral-700 pl-[0.7em]">
          {node.children.map((child) => (
            <TreeNode
              key={(child.children ? 'd:' : 'f:') + child.name}
              node={child}
              siblingMax={childMax}
              openAll={openAll}
            />
          ))}
        </div>
      )}
    </details>
  )
}
