import { createContext } from 'react'

// ページの表示時間を進めてよいか。
// ローディング中は Page1 を透明のままマウントして、レイアウト計算やフォント・画像の
// 読み込みを先に済ませる。その間に遷移タイマーや同時刻セッションの切り替えが進むと、
// 見えている時間が短くなるので、表示が始まるまで false にして止めておく。
// Provider が無い場所（テストなど）では常に true。
export const PageRunningCtx = createContext(true)
