type Props = { className?: string }

// 中止になったトークに付けるラベル
export function CancelledBadge({ className = '' }: Props) {
  return (
    <span
      className={`inline-block px-3 py-0.5 rounded-full bg-[#1E1E1E] text-white font-ryo-gothic-plusn font-bold tracking-wider ${className}`}
    >
      中止
    </span>
  )
}
