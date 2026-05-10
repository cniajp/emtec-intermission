import { useEffect, useState } from 'react'
import type {
  CompanionConfig,
  ButtonCell,
  ActionInfo,
} from './CompanionConfigGenerate'

type Props = {
  config: CompanionConfig
}

function intToHex(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`
}

function summarizeAction(action: ActionInfo): string {
  const opts = action.options
  switch (action.definitionId) {
    case 'macroRunStart':
      return `Run macro #${opts.MacroIndex}`
    case 'send': {
      const payload = String(opts.id_send ?? '')
      return `Send "${payload}"`
    }
    case 'set_scene':
      return `Set scene → ${opts.scene}`
    case 'set_page_byindex':
      return `Go to page ${opts.page}`
    default:
      return action.definitionId
  }
}

const CONNECTION_CHIP_STYLES: Record<string, string> = {
  'gostream-series': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'VR-6HD': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  obs: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  internal: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
}

function connectionChipClass(label: string): string {
  return (
    CONNECTION_CHIP_STYLES[label] ??
    'bg-neutral-700/60 text-neutral-300 border-neutral-600'
  )
}

type ActionAccordionProps = {
  index: number
  action: ActionInfo
  isOpen: boolean
  onToggle: () => void
}

function ActionAccordion({
  index,
  action,
  isOpen,
  onToggle,
}: ActionAccordionProps) {
  const optionEntries = Object.entries(action.options)
  return (
    <div className="border border-neutral-700 rounded overflow-hidden bg-neutral-950/40">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-neutral-800/60 transition-colors text-left"
      >
        <span
          className={`inline-block w-3 transition-transform text-neutral-500 ${
            isOpen ? 'rotate-90' : ''
          }`}
        >
          ▶
        </span>
        <span className="text-neutral-500 font-mono text-[10px] w-4">
          {index + 1}
        </span>
        <span
          className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-mono ${connectionChipClass(
            action.connectionLabel
          )}`}
        >
          {action.connectionLabel}
        </span>
        <span className="text-neutral-200 flex-1 truncate">
          {action.headline ?? summarizeAction(action)}
        </span>
        <span className="text-neutral-500 text-[10px] font-mono shrink-0">
          {action.definitionId}
        </span>
      </button>
      {isOpen && (
        <div className="px-3 py-2 border-t border-neutral-800 bg-black/30 space-y-2">
          {action.headline && (
            <div className="text-[11px] text-neutral-400">
              {summarizeAction(action)}
            </div>
          )}
          {optionEntries.length === 0 ? (
            <div className="text-neutral-500 text-[11px]">No options</div>
          ) : (
            <table className="w-full font-mono text-[11px]">
              <tbody>
                {optionEntries.map(([k, v]) => (
                  <tr key={k} className="align-top">
                    <td className="text-neutral-500 pr-3 py-0.5 whitespace-nowrap">
                      {k}
                    </td>
                    <td className="text-neutral-200 py-0.5 break-all">
                      {JSON.stringify(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default function CompanionPreview({ config }: Props) {
  const [pageIndex, setPageIndex] = useState(0)
  const [selected, setSelected] = useState<{
    row: number
    col: number
  } | null>(null)
  const [openActions, setOpenActions] = useState<Set<number>>(new Set())
  const totalPages = config.pagePreviews.length
  const page = config.pagePreviews[pageIndex]

  const selectedCell: ButtonCell | null =
    selected !== null && page ? page.buttons[selected.row][selected.col] : null

  // 選択が変わったらアコーディオンを初期化（最初のアクションだけ展開）
  useEffect(() => {
    if (selectedCell && selectedCell.actions.length > 0) {
      setOpenActions(new Set([0]))
    } else {
      setOpenActions(new Set())
    }
  }, [selected, pageIndex, selectedCell])

  if (!page) return null

  const changePage = (next: number) => {
    setPageIndex(next)
    setSelected(null)
  }

  const handleCellClick = (row: number, col: number) => {
    if (selected && selected.row === row && selected.col === col) {
      setSelected(null)
    } else if (page.buttons[row][col]) {
      setSelected({ row, col })
    }
  }

  const toggleAction = (i: number) => {
    setOpenActions((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const allOpen =
    selectedCell !== null &&
    selectedCell.actions.length > 0 &&
    openActions.size === selectedCell.actions.length

  const toggleAllActions = () => {
    if (!selectedCell) return
    if (allOpen) {
      setOpenActions(new Set())
    } else {
      setOpenActions(new Set(selectedCell.actions.map((_, i) => i)))
    }
  }

  return (
    <div className="text-white flex flex-wrap gap-4 items-start">
      <div className="shrink-0">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => changePage(Math.max(0, pageIndex - 1))}
            disabled={pageIndex === 0}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-30"
          >
            ←
          </button>
          <span className="font-mono">
            {page.name} ({pageIndex + 1} / {totalPages})
          </span>
          <button
            onClick={() => changePage(Math.min(totalPages - 1, pageIndex + 1))}
            disabled={pageIndex === totalPages - 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-30"
          >
            →
          </button>
        </div>

        <div className="inline-block bg-gray-900 p-2 rounded">
          {page.buttons.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((cell, colIdx) => {
                const isSelected =
                  selected?.row === rowIdx && selected?.col === colIdx
                return (
                  <button
                    type="button"
                    key={colIdx}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    disabled={!cell}
                    className={[
                      'w-20 h-20 m-1 rounded flex items-center justify-center text-center text-xs leading-tight whitespace-pre-line break-all p-1 border transition-all',
                      cell
                        ? 'cursor-pointer hover:brightness-125'
                        : 'cursor-default',
                      isSelected
                        ? 'border-blue-400 ring-2 ring-blue-400'
                        : 'border-gray-700',
                    ].join(' ')}
                    style={{
                      backgroundColor: cell
                        ? intToHex(cell.bgcolor)
                        : '#1f2937',
                      color: cell ? intToHex(cell.color) : '#4b5563',
                    }}
                  >
                    {cell ? cell.text : ''}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-[420px] bg-neutral-900 border border-neutral-700 rounded text-xs min-h-[440px] max-h-[680px] overflow-auto">
        {selectedCell ? (
          <div className="p-3">
            <div className="pb-3 mb-3 border-b border-neutral-800">
              <div className="flex items-baseline gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-neutral-800 rounded border border-neutral-700">
                  R{selected!.row}·C{selected!.col}
                </span>
                <span className="text-white font-semibold whitespace-pre-line">
                  {selectedCell.text || '(empty)'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500">
                <span>size {selectedCell.size}</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-sm border border-neutral-700"
                    style={{ backgroundColor: intToHex(selectedCell.color) }}
                  />
                  {intToHex(selectedCell.color)}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-sm border border-neutral-700"
                    style={{ backgroundColor: intToHex(selectedCell.bgcolor) }}
                  />
                  {intToHex(selectedCell.bgcolor)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-neutral-400 text-[11px] font-medium uppercase tracking-wider">
                Actions
                <span className="ml-1.5 text-neutral-600">
                  ({selectedCell.actions.length})
                </span>
              </div>
              {selectedCell.actions.length > 1 && (
                <button
                  type="button"
                  onClick={toggleAllActions}
                  className="text-[10px] text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {allOpen ? 'Collapse all' : 'Expand all'}
                </button>
              )}
            </div>

            {selectedCell.actions.length === 0 ? (
              <div className="text-neutral-500 italic">No actions</div>
            ) : (
              <div className="space-y-1.5">
                {selectedCell.actions.map((a, i) => (
                  <ActionAccordion
                    key={i}
                    index={i}
                    action={a}
                    isOpen={openActions.has(i)}
                    onToggle={() => toggleAction(i)}
                  />
                ))}
              </div>
            )}

            <details className="mt-3 group">
              <summary className="cursor-pointer text-neutral-500 hover:text-neutral-300 select-none text-[10px] uppercase tracking-wider">
                Raw JSON
              </summary>
              <pre className="mt-2 p-2 bg-black/50 rounded text-[10px] text-neutral-300 overflow-auto max-h-48">
                {JSON.stringify(selectedCell.raw, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div className="p-6 text-neutral-500 text-center">
            Click a button to see its actions
          </div>
        )}
      </div>
    </div>
  )
}
