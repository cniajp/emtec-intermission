export function trim(str: string, len: number) {
  return str.length > len ? str.substring(0, len - 3) + '...' : str
}

// 登壇者名を 1 行に収めるための表記にする。
// 2 名までは全員を「, 」区切りで、3 名以上は先頭 1 名 +「他N名」にまとめる。
// 名前が空・未設定の登壇者は数えない
export function summarizeSpeakerNames(
  names: ReadonlyArray<string | null | undefined>
) {
  const valid = names.filter((name): name is string => !!name)
  if (valid.length <= 2) {
    return valid.join(', ')
  }
  return `${valid[0]} 他${valid.length - 1}名`
}
