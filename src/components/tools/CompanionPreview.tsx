import { useState } from 'react'
import type {
  CompanionConfig,
  ButtonCell,
  ActionInfo,
} from './CompanionConfigGenerate'

type Props = {
  config: CompanionConfig
}

type Position = { row: number; col: number }

function intToHex(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`
}

/**
 * アクションを人が読める1行にする
 */
function summarizeAction(action: ActionInfo): string {
  const opts = action.options
  switch (action.definitionId) {
    case 'macroRunStart':
      return `マクロ #${opts.MacroIndex} を実行`
    case 'send':
      return `コマンド "${String(opts.id_send ?? '').trim()}" を送信`
    case 'set_scene':
      return `シーン「${opts.scene}」に切り替え`
    case 'set_page_byindex':
      return `ページ ${opts.page} へ移動`
    default:
      return action.definitionId
  }
}

// 接続ごとの表示名と色。スイッチャー / OBS / Companion 自身
const CONNECTIONS: Record<string, { label: string; className: string }> = {
  'gostream-series': {
    label: 'GoStream',
    className: 'bg-purple-500/15 text-purple-300',
  },
  'VR-6HD': { label: 'VR-6HD', className: 'bg-purple-500/15 text-purple-300' },
  obs: { label: 'OBS', className: 'bg-emerald-500/15 text-emerald-300' },
  internal: {
    label: 'Companion',
    className: 'bg-amber-500/15 text-amber-300',
  },
}

function ConnectionChip({ label }: { label: string }) {
  const conn = CONNECTIONS[label] ?? {
    label,
    className: 'bg-neutral-700/60 text-neutral-300',
  }
  return (
    <span
      className={`inline-block shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${conn.className}`}
    >
      {conn.label}
    </span>
  )
}

// ボタンが切り替える OBS シーン (なければ null)
function obsSceneOf(cell: ButtonCell): string | null {
  const action = cell.actions.find((a) => a.definitionId === 'set_scene')
  return action ? String(action.options.scene) : null
}

// ページ移動ボタンなら移動先の説明
function pageMoveOf(cell: ButtonCell): string | null {
  const action = cell.actions.find((a) => a.definitionId === 'set_page_byindex')
  return action ? `ページ ${action.options.page} へ移動` : null
}

function positionLabel({ row, col }: Position) {
  return `${row + 1}行 ${col + 1}列`
}

export default function CompanionPreview({ config }: Props) {
  const [pageIndex, setPageIndex] = useState(0)
  const [selected, setSelected] = useState<Position | null>(null)
  const page = config.pagePreviews[pageIndex]
  if (!page) return null

  const selectedCell: ButtonCell | null = selected
    ? page.buttons[selected.row][selected.col]
    : null

  const changePage = (next: number) => {
    setPageIndex(next)
    setSelected(null)
  }

  const handleCellClick = (row: number, col: number) => {
    if (selected?.row === row && selected?.col === col) {
      setSelected(null)
    } else if (page.buttons[row][col]) {
      setSelected({ row, col })
    }
  }

  return (
    <div className="flex gap-5 items-start text-[12px] text-white">
      <div className="shrink-0 flex flex-col gap-3">
        {config.pagePreviews.length > 1 && (
          <div className="inline-flex w-fit rounded-sm border border-neutral-600 bg-neutral-900 p-0.5">
            {config.pagePreviews.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => changePage(i)}
                className={`px-3 py-1 rounded-sm transition-colors ${
                  i === pageIndex
                    ? 'bg-blue-600 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Stream Deck (5×3) を模した盤面 */}
        <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-3 shadow-inner">
          <div className="grid grid-cols-5 gap-2">
            {page.buttons.flatMap((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const isSelected =
                  selected?.row === rowIdx && selected?.col === colIdx
                return (
                  <button
                    type="button"
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    disabled={!cell}
                    className={`w-[76px] h-[76px] rounded-lg p-1 flex items-center justify-center text-center text-[13px] font-medium leading-tight whitespace-pre-line break-all transition ${
                      cell
                        ? 'cursor-pointer border border-neutral-700 hover:border-neutral-400'
                        : 'cursor-default border border-dashed border-neutral-800'
                    } ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-neutral-950' : ''}`}
                    style={
                      cell
                        ? {
                            backgroundColor: intToHex(cell.bgcolor),
                            color: intToHex(cell.color),
                          }
                        : undefined
                    }
                  >
                    {cell?.text}
                  </button>
                )
              })
            )}
          </div>
        </div>
        <p className="text-[11px] text-neutral-500">
          ボタンをクリックすると実行内容を表示
        </p>
      </div>

      <div className="flex-1 min-w-0 h-[380px] rounded-lg border border-neutral-700 bg-neutral-900 overflow-auto">
        {selectedCell && selected ? (
          <ButtonDetail
            cell={selectedCell}
            position={selected}
            onClose={() => setSelected(null)}
          />
        ) : (
          <PageSummary buttons={page.buttons} onSelect={handleCellClick} />
        )}
      </div>
    </div>
  )
}

/**
 * 未選択時: このページのボタンと切り替わる OBS シーンの一覧
 */
function PageSummary({
  buttons,
  onSelect,
}: {
  buttons: (ButtonCell | null)[][]
  onSelect: (row: number, col: number) => void
}) {
  const items = buttons.flatMap((row, r) =>
    row.flatMap((cell, c) => (cell ? [{ cell, row: r, col: c }] : []))
  )
  return (
    <div className="p-4">
      <div className="mb-2 text-[11px] font-medium text-neutral-400">
        このページのボタン
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-[11px] text-neutral-500">
            <th className="pb-1.5 font-normal">位置</th>
            <th className="pb-1.5 font-normal">ボタン</th>
            <th className="pb-1.5 font-normal">OBS シーン</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ cell, row, col }) => {
            const scene = obsSceneOf(cell)
            return (
              <tr
                key={`${row}-${col}`}
                onClick={() => onSelect(row, col)}
                className="cursor-pointer border-t border-neutral-800 hover:bg-neutral-800/60"
              >
                <td className="py-1.5 pr-3 text-[11px] text-neutral-500 whitespace-nowrap">
                  {positionLabel({ row, col })}
                </td>
                <td className="py-1.5 pr-3 whitespace-nowrap">
                  {cell.text.replace(/\n/g, ' ')}
                </td>
                <td className="py-1.5 font-mono text-[11px] text-neutral-300">
                  {scene ?? (
                    <span className="font-sans text-neutral-500">
                      {pageMoveOf(cell) ?? '—'}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * 選択時: ボタンが押されたときに順に実行されるアクション
 */
function ButtonDetail({
  cell,
  position,
  onClose,
}: {
  cell: ButtonCell
  position: Position
  onClose: () => void
}) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 shrink-0 rounded-md border border-neutral-700 flex items-center justify-center text-center text-[10px] leading-tight whitespace-pre-line"
          style={{
            backgroundColor: intToHex(cell.bgcolor),
            color: intToHex(cell.color),
          }}
        >
          {cell.text}
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-bold whitespace-pre-line">
            {cell.text.replace(/\n/g, ' ') || '(ラベルなし)'}
          </div>
          <div className="text-[11px] text-neutral-500">
            {positionLabel(position)} ・ 文字サイズ {cell.size}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-[11px] text-neutral-400 hover:text-white"
        >
          一覧に戻る
        </button>
      </div>

      <div>
        <div className="mb-2 text-[11px] font-medium text-neutral-400">
          押したときの動作 ({cell.actions.length})
        </div>
        {cell.actions.length === 0 ? (
          <div className="text-neutral-500">アクションなし</div>
        ) : (
          <ol className="flex flex-col gap-1.5">
            {cell.actions.map((action, i) => (
              <ActionItem key={i} index={i} action={action} />
            ))}
          </ol>
        )}
      </div>

      <details>
        <summary className="cursor-pointer select-none text-[11px] text-neutral-500 hover:text-neutral-300">
          ボタンの JSON
        </summary>
        <pre className="mt-2 max-h-48 overflow-auto rounded-sm bg-black/50 p-2 text-[10px] text-neutral-300">
          {JSON.stringify(cell.raw, null, 2)}
        </pre>
      </details>
    </div>
  )
}

function ActionItem({ index, action }: { index: number; action: ActionInfo }) {
  const [open, setOpen] = useState(false)
  const options = Object.entries(action.options)
  return (
    <li className="rounded-md border border-neutral-700 bg-neutral-950/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-neutral-800/60"
      >
        <span className="w-4 shrink-0 text-[11px] text-neutral-500">
          {index + 1}.
        </span>
        <ConnectionChip label={action.connectionLabel} />
        <span className="flex-1 truncate">{summarizeAction(action)}</span>
        <span
          className={`shrink-0 text-[10px] text-neutral-500 transition-transform ${open ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="border-t border-neutral-800 px-3 py-2 text-[11px]">
          <div className="mb-1 font-mono text-neutral-500">
            {action.definitionId}
            {action.headline && ` — ${action.headline}`}
          </div>
          {options.length === 0 ? (
            <div className="text-neutral-500">オプションなし</div>
          ) : (
            <table className="w-full font-mono">
              <tbody>
                {options.map(([k, v]) => (
                  <tr key={k} className="align-top">
                    <td className="py-0.5 pr-3 whitespace-nowrap text-neutral-500">
                      {k}
                    </td>
                    <td className="py-0.5 break-all text-neutral-200">
                      {JSON.stringify(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </li>
  )
}
