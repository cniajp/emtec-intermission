import { useEffect, useMemo, useState } from 'react'
import type { Talk, Track } from '@/data/types'
import { MenuView } from '@/logic/models/talkView'
import type { Optional } from '@/utils/types'

// 前回取得したメニューのデータ（localStorage に置く）
export type MenuSnapshot = {
  talks: Talk[]
  tracks: Track[]
  // 利用可能な Day 番号（1 始まり）
  allDays: number[]
  // 保存した時刻（ms）
  savedAt: number
}

// 形を変えたら v を上げる（古い形のデータを読まないように）
const KEY_PREFIX = 'emtec-im:menu:v1'

export function menuSnapshotKey(eventAbbr: string, day: number): string {
  return `${KEY_PREFIX}:${eventAbbr}:${day}`
}

export function readMenuSnapshot(key: string): MenuSnapshot | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<MenuSnapshot>
    if (
      !Array.isArray(data.talks) ||
      !Array.isArray(data.tracks) ||
      !Array.isArray(data.allDays)
    ) {
      return null
    }
    return {
      talks: data.talks,
      tracks: data.tracks,
      allDays: data.allDays,
      savedAt: typeof data.savedAt === 'number' ? data.savedAt : 0,
    }
  } catch {
    // 壊れたデータ、localStorage が使えない環境（プライベートモードなど）
    return null
  }
}

export function writeMenuSnapshot(key: string, snapshot: MenuSnapshot): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(snapshot))
  } catch {
    // 容量超過などで保存できなくても、表示には影響させない
  }
}

type Fresh = {
  view: Optional<MenuView>
  allDays: number[]
}

/**
 * メニューのデータを、API から届く前は「前回取得したデータ」で先に出す。
 * - API のデータ（fresh.view）が届いたら、そちらを返して localStorage に保存する
 * - 届くまでは、同じキーで保存してあるデータがあればそれを返す（isFromSnapshot が true）
 *
 * key が null の間（ルーターの準備前など）は何も読まない。
 */
export function useMenuSnapshot(
  key: string | null,
  fresh: Fresh
): { view: Optional<MenuView>; allDays: number[]; isFromSnapshot: boolean } {
  // キーが変わったら（日を切り替えたら）読み直す
  const [loaded, setLoaded] = useState<{
    key: string | null
    snapshot: MenuSnapshot | null
  }>({ key: null, snapshot: null })
  if (loaded.key !== key) {
    setLoaded({ key, snapshot: key ? readMenuSnapshot(key) : null })
  }

  const { view: freshView, allDays: freshDays } = fresh
  useEffect(() => {
    if (!key || !freshView) return
    writeMenuSnapshot(key, {
      talks: freshView.allTalks,
      tracks: freshView.allTracks,
      allDays: freshDays,
      savedAt: Date.now(),
    })
  }, [key, freshView, freshDays])

  const snapshot = loaded.key === key ? loaded.snapshot : null
  const snapshotView = useMemo(
    () => (snapshot ? new MenuView(snapshot.talks, snapshot.tracks, []) : null),
    [snapshot]
  )

  if (freshView) {
    return { view: freshView, allDays: freshDays, isFromSnapshot: false }
  }
  if (snapshot && snapshotView) {
    return {
      view: snapshotView,
      // event が先に届いていれば、日付の一覧は新しいほうを使う
      allDays: freshDays.length > 0 ? freshDays : snapshot.allDays,
      isFromSnapshot: true,
    }
  }
  return { view: null, allDays: freshDays, isFromSnapshot: false }
}
