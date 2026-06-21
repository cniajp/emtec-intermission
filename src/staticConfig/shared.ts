export type TrackImageInsert = { position: number; src: string }
export type TrackImageInserts = Record<number, ReadonlyArray<TrackImageInsert>>

export function buildPage3Images(
  common: ReadonlyArray<string>,
  inserts: ReadonlyArray<TrackImageInsert> | undefined
): string[] {
  const result = [...common]
  if (!inserts || inserts.length === 0) return result
  const sorted = [...inserts].sort((a, b) => a.position - b.position)
  for (const { position, src } of sorted) {
    const idx = Math.max(0, Math.min(result.length, position - 1))
    result.splice(idx, 0, src)
  }
  return result
}
