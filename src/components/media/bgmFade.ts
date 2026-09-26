// BGM のクロスフェード用の計算。

// 今の曲の残りが fadeSeconds 以下になったら次の曲を重ね始める。
// duration が不明（NaN / Infinity）なら判定できないので false（ended で曲送りする）
export function shouldStartCrossfade(
  currentTime: number,
  duration: number,
  fadeSeconds: number
): boolean {
  if (fadeSeconds <= 0 || !Number.isFinite(duration)) return false
  return duration - currentTime <= fadeSeconds
}

// フェードの進み具合（0〜1）。経過秒数 / フェード秒数。
// クロスフェードでは新しい曲の再生位置を経過秒数として渡すので、
// 読み込み待ちで新しい曲が鳴り出すのが遅れても、その間は前の曲が鳴り続ける
// （新しい曲の音量 = 進み具合、前の曲の音量 = 1 - 進み具合）。
// CM 明けのフェードインでは再開からの経過秒数を渡す
export function fadeProgress(elapsed: number, fadeSeconds: number): number {
  if (fadeSeconds <= 0) return 1
  return Math.max(0, Math.min(1, elapsed / fadeSeconds))
}
