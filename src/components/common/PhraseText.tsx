import { Fragment, useEffect, useState } from 'react'

type Parser = { parse(text: string): string[] }

// budoux（日本語モデル込みで gzip 約 9KB）は初期バンドルに入れず、初回マウント時に動的 import する。
// 読み込みは 1 回だけ行い、以降のマウントは loadedParser で最初から分割済みの描画になる。
let parserPromise: Promise<Parser> | null = null
let loadedParser: Parser | null = null

function loadParser(): Promise<Parser> {
  if (!parserPromise) {
    parserPromise = import('budoux').then((m) => {
      loadedParser = m.loadDefaultJapaneseParser()
      return loadedParser
    })
  }
  return parserPromise
}

/**
 * 日本語テキストを BudouX で文節に分割し、境界に <wbr> を挿入して返す。
 * 親要素に `break-keep`（word-break: keep-all）を当てると、文節境界でだけ折り返される。
 * パーサー読み込み前（SSR 含む）はプレーン文字列をそのまま描画する。
 * 英語のみ・空文字の場合は分割されずそのまま描画される。
 */
export function PhraseText({ text }: { text: string }) {
  const [parser, setParser] = useState<Parser | null>(() => loadedParser)

  useEffect(() => {
    if (parser) return
    let alive = true
    loadParser().then((p) => {
      if (alive) setParser(p)
    })
    return () => {
      alive = false
    }
  }, [parser])

  if (!parser) {
    return <>{text}</>
  }

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
