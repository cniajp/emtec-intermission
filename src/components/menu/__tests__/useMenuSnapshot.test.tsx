import { renderHook } from '@testing-library/react'
import {
  menuSnapshotKey,
  readMenuSnapshot,
  useMenuSnapshot,
  writeMenuSnapshot,
} from '@/components/menu/useMenuSnapshot'
import { MenuView } from '@/logic/models/talkView'
import type { Talk, Track } from '@/data/types'

const tracks = [{ id: 1, name: 'A' }] as Track[]
const talk = (id: number, title: string): Talk => ({
  id,
  trackId: 1,
  title,
  abstract: '',
  speakers: [],
  startTime: '2026-11-18T10:00:00+09:00',
  endTime: '2026-11-18T10:40:00+09:00',
  conferenceDayId: 1,
  showOnTimetable: true,
})

const KEY = menuSnapshotKey('cndw2026', 1)
const titles = (view?: MenuView | null) => view?.allTalks.map((t) => t.title)

beforeEach(() => window.localStorage.clear())

describe('readMenuSnapshot / writeMenuSnapshot', () => {
  it('保存したデータを読み戻せる', () => {
    writeMenuSnapshot(KEY, {
      talks: [talk(1, 'old')],
      tracks,
      allDays: [1, 2],
      savedAt: 123,
    })
    expect(readMenuSnapshot(KEY)).toEqual({
      talks: [talk(1, 'old')],
      tracks,
      allDays: [1, 2],
      savedAt: 123,
    })
  })

  it('イベントと日ごとに別のキーになる', () => {
    expect(menuSnapshotKey('cndw2026', 1)).not.toBe(
      menuSnapshotKey('cndw2026', 2)
    )
    expect(menuSnapshotKey('cndw2026', 1)).not.toBe(
      menuSnapshotKey('cnds2026', 1)
    )
  })

  it('無い・壊れている・形が違うデータは null', () => {
    expect(readMenuSnapshot(KEY)).toBeNull()
    window.localStorage.setItem(KEY, '{broken')
    expect(readMenuSnapshot(KEY)).toBeNull()
    window.localStorage.setItem(KEY, JSON.stringify({ talks: 'x' }))
    expect(readMenuSnapshot(KEY)).toBeNull()
  })
})

describe('useMenuSnapshot', () => {
  const NONE = { view: null, allDays: [] as number[] }

  it('API のデータが届く前は、保存してあるデータを返す', () => {
    writeMenuSnapshot(KEY, {
      talks: [talk(1, 'old')],
      tracks,
      allDays: [1, 2],
      savedAt: 1,
    })
    const { result } = renderHook(() => useMenuSnapshot(KEY, NONE))
    expect(titles(result.current.view)).toEqual(['old'])
    expect(result.current.allDays).toEqual([1, 2])
    expect(result.current.isFromSnapshot).toBe(true)
  })

  it('API のデータが届いたらそちらを返し、保存し直す', () => {
    writeMenuSnapshot(KEY, {
      talks: [talk(1, 'old')],
      tracks,
      allDays: [1],
      savedAt: 1,
    })
    const fresh = {
      view: new MenuView([talk(1, 'new')], tracks, []),
      allDays: [1, 2, 3],
    }
    const { result, rerender } = renderHook(
      (props) => useMenuSnapshot(KEY, props),
      { initialProps: NONE as typeof fresh | typeof NONE }
    )
    expect(titles(result.current.view)).toEqual(['old'])

    rerender(fresh)
    expect(titles(result.current.view)).toEqual(['new'])
    expect(result.current.allDays).toEqual([1, 2, 3])
    expect(result.current.isFromSnapshot).toBe(false)
    expect(readMenuSnapshot(KEY)?.talks[0].title).toBe('new')
    expect(readMenuSnapshot(KEY)?.allDays).toEqual([1, 2, 3])
  })

  it('保存が無ければ、届くまで null', () => {
    const { result } = renderHook(() => useMenuSnapshot(KEY, NONE))
    expect(result.current).toEqual({
      view: null,
      allDays: [],
      isFromSnapshot: false,
    })
  })

  it('キーが null の間は読まない。キーが変わったら読み直す', () => {
    writeMenuSnapshot(KEY, {
      talks: [talk(1, 'day1')],
      tracks,
      allDays: [1, 2],
      savedAt: 1,
    })
    const key2 = menuSnapshotKey('cndw2026', 2)
    writeMenuSnapshot(key2, {
      talks: [talk(2, 'day2')],
      tracks,
      allDays: [1, 2],
      savedAt: 1,
    })
    const { result, rerender } = renderHook(
      ({ key }: { key: string | null }) => useMenuSnapshot(key, NONE),
      { initialProps: { key: null as string | null } }
    )
    expect(result.current.view).toBeNull()

    rerender({ key: KEY })
    expect(titles(result.current.view)).toEqual(['day1'])
    rerender({ key: key2 })
    expect(titles(result.current.view)).toEqual(['day2'])
  })

  it('event だけ先に届いたら、日付の一覧は新しいほうを使う', () => {
    writeMenuSnapshot(KEY, {
      talks: [talk(1, 'old')],
      tracks,
      allDays: [1],
      savedAt: 1,
    })
    const { result } = renderHook(() =>
      useMenuSnapshot(KEY, { view: null, allDays: [1, 2] })
    )
    expect(result.current.allDays).toEqual([1, 2])
    expect(result.current.isFromSnapshot).toBe(true)
  })
})
