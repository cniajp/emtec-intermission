# Page1セッションカードの仕様（defaultテーマ）

対象: `src/themes/default/page1/Main.tsx`
策定: 2026-09-22（pek2026対応時）

## 決めたこと

| 項目 | 仕様 | 実装 |
|---|---|---|
| カード高さ | カテゴリ/難易度行があれば668px、なければ630px | `hasMeta`で切り替え |
| タイトル折り返し | 日本語は文節単位。語の途中で改行しない | `PhraseText`（BudouX + `<wbr>`）+ `break-keep`。budouxは動的import（初期バンドル外） |
| タイトル切り捨て | **禁止**。収まらなければフォントを縮めて全文表示 | `ShrinkToFit`（2px刻み、下限16px） |

部品は`src/components/common/`にある。他のテーマや箇所でも使い回せる。

## 背景

- **カード高さ**: 630pxはカテゴリ行がないトークを見て決めた値だった。カテゴリ行（38px）があるとAbstractの4行目がカードからはみ出していた。pek2026はKeynote以外カテゴリが空なので、行がある時だけ伸ばす方式にした。
- **折り返し**: `wrap-break-word`だけだと日本語はどの文字間でも改行され、「ノンエンジニ／ア」のように語が割れていた。CSSの`word-break: auto-phrase`はChromium 119以降限定でOBSのブラウザソースで効く保証がないため、BudouXで分割する方式にした。モデルはgzip約9KBだが初期バンドルから外すため遅延読み込みにしている（読み込み前はプレーン文字列、ロード演出中に差し替わる）。
- **切り捨て禁止**: 文節で折ると行が短くなり、`line-clamp-3`で末尾が消えるタイトルが出た（pek2026では1件）。タイトルは全文出すことが要件なので、clampをやめて自動縮小に切り替えた。

## 未対応（同じ課題が残っている箇所）

- `src/themes/default/page1/Side.tsx`（右カラムのタイトル、`line-clamp-3`）
- `src/themes/default/page2/index.tsx`
- `src/themes/kinoko/page1/Main.tsx`

## 確認用URL

```
/break/talks/102?debug=true&transTimePage1=600   # 長い日本語タイトル、カード630px
/break/talks/101?debug=true&transTimePage1=600   # 英語タイトル、Keynote、カード668px
/break/talks/204?debug=true&transTimePage1=600   # 縮小が入るタイトル（40px→36px）
```
