/**
 * OBS のシーン名。
 * ObsSceneGenerate が作るシーンを CompanionConfigGenerate のボタンが名前で呼び出すので、
 * 両方ここから参照して名前を揃える
 */
export const OBS_SCENE = {
  futa: 'FUTA',
  countdown: 'CountDown',
  // Companion では TrackA ボタン。VLC / Browser どちらの取り込みでもこの名前
  simul: 'サイマル',
  // Companion の Clear / Slido ボタンが呼ぶ空シーンを兼ねる
  separator: '------',
} as const

// トーク枠のシーン名。time は 'HH:mm'
export const talkSceneName = (time: string) => `${time} ~`

// アタック動画のシーン名。time は 'HH:mm'
export const attackSceneName = (time: string) => `Attack_${time}`

/**
 * トラックのトークを開始順に並べ、シーン名に使う開始時刻 'HH:mm' の配列にする。
 * OBS のシーン名と Companion のボタンが同じ時刻表記になるよう両方ここを通す
 */
export function sceneTimesOf(talks: ReadonlyArray<{ startTime: string }>) {
  return [...talks]
    .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
    .map((talk) => sceneTimeOf(talk.startTime))
}

export function sceneTimeOf(startTime: string) {
  const date = new Date(startTime)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
