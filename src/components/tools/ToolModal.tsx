import { useState, type ReactNode } from 'react'

/**
 * メニューの OBS / Companion エクスポート設定モーダルで共通の部品。
 * 見た目を揃えるため、モーダル枠・行・入力はここから使う
 */

export function ToolModal({
  title,
  subtitle,
  widthClass = 'w-[640px]',
  onClose,
  help,
  footer,
  children,
}: {
  title: string
  subtitle: string
  widthClass?: string
  onClose: () => void
  // ヘッダの「?」で開閉する使い方の説明
  help?: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  const [showHelp, setShowHelp] = useState(false)
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl ${widthClass} max-w-[95vw] max-h-[90vh] flex flex-col text-[14px] text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start px-5 py-3 border-b border-neutral-700">
          <div>
            <h3 className="text-[14px] font-bold">{title}</h3>
            <p className="text-[12px] text-neutral-400">{subtitle}</p>
          </div>
          {help && (
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              aria-expanded={showHelp}
              className={`ml-auto flex items-center gap-1 rounded-sm px-2 py-1 text-[11px] transition-colors ${
                showHelp
                  ? 'bg-blue-600/20 text-blue-300'
                  : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px]">
                ?
              </span>
              使い方
            </button>
          )}
        </div>
        <div className="px-5 py-4 overflow-y-auto flex flex-col gap-4">
          {help && showHelp && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-[12px] leading-relaxed text-neutral-300">
              {help}
            </div>
          )}
          {children}
        </div>
        <div className="flex gap-3 justify-end px-5 py-3 border-t border-neutral-700">
          {footer}
        </div>
      </div>
    </div>
  )
}

export function ModalButton({
  variant = 'secondary',
  onClick,
  className = '',
  children,
}: {
  variant?: 'primary' | 'secondary'
  onClick: () => void
  className?: string
  children: ReactNode
}) {
  const color =
    variant === 'primary'
      ? 'bg-blue-600 hover:bg-blue-500 font-medium'
      : 'bg-neutral-700 hover:bg-neutral-600'
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-[12px] rounded-sm transition-colors ${color} ${className}`}
    >
      {children}
    </button>
  )
}

export function OptionList({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-lg border border-neutral-700 divide-y divide-neutral-700">
      {children}
    </section>
  )
}

/**
 * 項目1つ分の行。右端に対応する OBS シーン名を出す。
 * onToggle があれば ON/OFF でき、ON のときだけ children (設定) を開く
 */
export function OptionRow({
  title,
  description,
  scene,
  badge,
  enabled = true,
  onToggle,
  children,
}: {
  title: string
  // タイトル下に常に出す1行説明
  description?: ReactNode
  scene: string
  badge?: string
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
  children?: ReactNode
}) {
  return (
    <div className={enabled && children ? 'bg-neutral-900/40' : undefined}>
      <label
        className={`flex items-start gap-3 px-4 py-2.5 ${onToggle ? 'cursor-pointer hover:bg-neutral-700/30' : ''}`}
      >
        {onToggle ? (
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="mt-0.5 w-3.5 h-3.5 shrink-0 accent-blue-500"
          />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <span className="text-[12px] font-medium">{title}</span>
            {badge && (
              <span className="rounded-sm bg-green-600/20 px-1.5 py-0.5 text-[10px] text-green-400">
                {badge}
              </span>
            )}
          </span>
          {description && (
            <span className="text-[11px] leading-snug text-neutral-500">
              {description}
            </span>
          )}
        </span>
        <span className="ml-auto shrink-0 pt-0.5 font-mono text-[11px] text-neutral-500">
          {scene}
        </span>
      </label>
      {enabled && children && (
        <div className="flex flex-col gap-2.5 pl-[42px] pr-4 pb-3">
          {children}
        </div>
      )}
    </div>
  )
}

export function Field({
  label,
  action,
  grow,
  children,
}: {
  label: string
  action?: ReactNode
  grow?: boolean
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1 ${grow ? 'flex-1' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-neutral-400">{label}</span>
        {action}
      </div>
      {children}
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<readonly [T, string]>
}) {
  return (
    <div className="inline-flex rounded-sm border border-neutral-600 bg-neutral-900 p-0.5 w-fit">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-3 py-1 text-[12px] rounded-sm transition-colors ${
            value === v
              ? 'bg-blue-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
  list,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  list?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      list={list}
      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-600 rounded-sm text-[12px] text-white focus:outline-hidden focus:border-blue-500 disabled:opacity-40"
    />
  )
}

/**
 * ヘルプパネル内の番号付き手順
 */
export function HelpSteps({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal space-y-1 pl-4 text-[12px] leading-relaxed">
      {children}
    </ol>
  )
}

export function HelpNote({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[11px] text-neutral-400">{children}</p>
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm bg-neutral-900 px-1 py-0.5 font-mono text-[11px] text-neutral-200">
      {children}
    </code>
  )
}

/**
 * pathname + query を絶対 URL にしてクリップボードへコピーする。
 * 会場の LAN から http://<IP> で開くと navigator.clipboard が使えない (非セキュアコンテキスト) ので
 * execCommand('copy') にフォールバックする
 */
export function CopyUrlButton({
  pathname,
  query,
  className = '',
}: {
  pathname: string
  query: Record<string, string | number>
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const params = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, String(v)])
    )
    const url = `${window.location.origin}${pathname}?${params}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="開くとこの設定でそのままダウンロードされる URL"
      className={`px-3 py-1.5 text-[12px] rounded-sm transition-colors ${
        copied
          ? 'bg-green-600/20 text-green-400'
          : 'text-neutral-300 hover:bg-neutral-700'
      } ${className}`}
    >
      {copied ? 'コピーしました' : 'URL をコピー'}
    </button>
  )
}
