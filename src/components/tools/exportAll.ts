import { strToU8, zipSync } from 'fflate'

/**
 * 全トラック分をまとめてエクスポートするための共通部品。
 * OBS / Companion の生成ページは `trackId=all` で開くと全トラック分を ZIP 1つで返す
 */

// `trackId` クエリにこの値を入れると全トラックが対象になる
export const ALL_TRACKS = 'all'

export function isAllTracks(trackId: string | string[] | undefined) {
  return trackId === ALL_TRACKS
}

/**
 * その日にトークがあるトラックだけを id 順で返す。
 * トークの無いトラックは中身が空の設定になるだけなので、まとめて出すときは省く
 */
export function tracksWithTalks<T extends { id: number }>(
  tracks: ReadonlyArray<T>,
  talks: ReadonlyArray<{ trackId: number }>
): T[] {
  const used = new Set(talks.map((talk) => talk.trackId))
  return tracks
    .filter((track) => used.has(track.id))
    .sort((a, b) => a.id - b.id)
}

export type ExportFile = { name: string; text: string }

export function zipFiles(files: ReadonlyArray<ExportFile>): Uint8Array {
  return zipSync(
    Object.fromEntries(files.map((file) => [file.name, strToU8(file.text)]))
  )
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // クリック直後に破棄するとダウンロードが始まらないブラウザがある
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

/**
 * 1つならそのまま、複数なら ZIP にまとめてダウンロードする。
 * (複数ファイルを続けてダウンロードすると、ブラウザが2つ目以降を止めることがある)
 */
export function downloadExportFiles(
  files: ReadonlyArray<ExportFile>,
  zipName: string
) {
  if (files.length === 0) return
  if (files.length === 1) {
    downloadBlob(
      files[0].name,
      new Blob([files[0].text], { type: 'application/json' })
    )
    return
  }
  downloadBlob(
    zipName,
    new Blob([zipFiles(files) as BlobPart], { type: 'application/zip' })
  )
}
