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

// Service Worker のプリキャッシュ対象を決めるための最小限の形（break / breakDk 共通）
export type PrecacheSource = {
  base: {
    loadingIconSrc: string
    backgroundSrc: string
    audioSrcs: ReadonlyArray<string>
    defaultAvatarSrc: string
    headerLogoSrc: string
  }
  page3: { alias: string }
}

// 設定が参照しているアセットから、public/ 直下のフォルダ名を重複なしで返す。
// 例: '/jisaba2026/logo.png' → 'jisaba2026'、alias 'cndw2026/info' → 'cndw2026'
export function publicDirsOf(configs: ReadonlyArray<PrecacheSource>): string[] {
  const dirs = new Set<string>()
  for (const { base, page3 } of configs) {
    const paths = [
      base.loadingIconSrc,
      base.backgroundSrc,
      ...base.audioSrcs,
      base.defaultAvatarSrc,
      base.headerLogoSrc,
      `${page3.alias}/`,
    ]
    for (const p of paths) {
      // 外部 URL は public/ のファイルではない
      if (/^[a-z]+:\/\//i.test(p)) continue
      const segments = p.replace(/^\/+/, '').split('/')
      // public/ 直下のファイル（フォルダなし）は対象外
      if (segments.length >= 2 && segments[0]) dirs.add(segments[0])
    }
  }
  return [...dirs]
}

// プリキャッシュ一覧の 1 件（ビルド時の URL。例: 'public/jisaba2026/logo.png'）を残すか。
// public/ 以外（.next/static など）と public/ 直下のファイルは常に残し、
// public/ のフォルダは dirs に含まれるものだけ残す。
export function isPrecacheTarget(
  url: string,
  dirs: ReadonlyArray<string>
): boolean {
  if (!url.startsWith('public/')) return true
  const rest = url.slice('public/'.length)
  const slash = rest.indexOf('/')
  if (slash < 0) return true
  return dirs.includes(rest.slice(0, slash))
}
