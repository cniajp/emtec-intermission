// BGM の再生順（srcs の index の並び）を作る。
// shuffle=false なら配列順。true なら Fisher-Yates でシャッフルし、
// avoidFirst を指定すると（一周して並べ直すとき、直前の曲が続かないよう）先頭に来ないようにする。
export function makeBgmOrder(
  length: number,
  shuffle: boolean,
  avoidFirst?: number,
  random: () => number = Math.random
): number[] {
  const order = Array.from({ length }, (_, i) => i)
  if (!shuffle) return order
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  if (order.length > 1 && order[0] === avoidFirst) {
    // 先頭を末尾と入れ替える（末尾は必ず別の曲）
    ;[order[0], order[order.length - 1]] = [order[order.length - 1], order[0]]
  }
  return order
}
