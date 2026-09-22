import { Fragment } from 'react'
import { loadDefaultJapaneseParser } from 'budoux'

// モジュールスコープで 1 回だけ生成する（モデルのロードはそれなりに重い）
const parser = loadDefaultJapaneseParser()

/**
 * 日本語テキストを BudouX で文節に分割し、境界に <wbr> を挿入して返す。
 * 親要素に `break-keep`（word-break: keep-all）を当てると、文節境界でだけ折り返される。
 * 英語のみ・空文字の場合は分割されずそのまま描画される。
 */
export function PhraseText({ text }: { text: string }) {
  const phrases = parser.parse(text)
  return (
    <>
      {phrases.map((phrase, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {phrase}
        </Fragment>
      ))}
    </>
  )
}
