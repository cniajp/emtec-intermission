import { useContext } from 'react'
import { ClockCtx } from '@/logic/page-flow/ClockContext'

/**
 * 現在時刻（HH:mm:ss）。毎秒変わる ClockCtx を読むのはこのコンポーネントだけにして、
 * ヘッダーやページ本体を毎秒再レンダーさせない。
 */
export function Clock() {
  const { now } = useContext(ClockCtx)
  return <>{now.format('HH:mm:ss')}</>
}
