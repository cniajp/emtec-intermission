# 開発ガイド

このドキュメントは開発者向けの情報をまとめています。

## セットアップ

### 必要要件

- Node.js 24.20.0（`.node-version` / `volta.node` で固定。CI と Docker も同じバージョン）
- npm

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

## 環境変数

`.env.development` または `.env.production` で以下を設定します：

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | DreamkastのAPIエンドポイント |
| `NEXT_PUBLIC_EVENT_ABBR` | 静的データ用イベント略称 |
| `NEXT_PUBLIC_DK_EVENT_ABBR` | Dreamkast用イベント略称 |
| `NEXT_PUBLIC_TRANS_TIME_PAGE1` | Page1の表示時間（秒） |
| `NEXT_PUBLIC_TRANS_TIME_PAGE2` | Page2の表示時間（秒） |
| `NEXT_PUBLIC_TRANS_TIME_PAGE3` | Page3の表示時間（秒） |
| `NEXT_PUBLIC_DEBUG` | デバッグモード（'true' で有効） |
| `NEXT_PUBLIC_EXCLUDED_TALKS` | 除外するトークID（カンマ区切り） |

## ルーティング構造

```
/                              # トップページ（メニュー選択）
├── /break-dk/menu/[confDay]   # Dreamkast版メニュー（Day 0, 1, 2...）
├── /break-dk/talks/[talkId]   # Dreamkast版インターミッション表示
├── /break-dk/obs              # Dreamkast版OBS用ページ
├── /break/menu/[confDay]      # 静的データ版メニュー
├── /break/talks/[talkId]      # 静的データ版インターミッション表示
└── /break/obs                 # 静的データ版OBS用ページ
```

### データソース

このプロジェクトは2つのデータソースに対応しています：

1. **Dreamkast API連携** (`/break-dk/*`) - CloudNativeDaysのイベント管理システムからリアルタイムでデータ取得
2. **静的TSファイル** (`/break/*`) - ローカルのTSファイルからデータ取得

## アーキテクチャ（3つの差し替え軸）

インターミッション画面は、独立して差し替えられる3つの軸に分離されています。

| 軸 | ディレクトリ | 責務 | 差し替え方法 |
|----|------------|------|------------|
| **DataSource** | `src/logic/data/` | データ取得（Dreamkast API / 静的TS） | `getDataSource(name)` |
| **Brand** | `src/brand/` | イベント固有のアセット・文言 | `getBrand(name)` |
| **Theme** | `src/themes/` | 見た目（JSX / Tailwind / CSS） | `selectTheme(name)` |

`src/logic/` にはこの3軸に依存しないロジック（ページ遷移、ViewModel、`TalkView` / `MenuView` モデル）が入ります。

ページはこの3つを Provider で組み合わせるだけです（`src/pages/break/talks/[talkId].tsx`）：

```tsx
<BrandProvider brand={brand}>
  <ThemeProvider theme={theme}>
    <PageCtxProvider>
      <Pages />
    </PageCtxProvider>
  </ThemeProvider>
</BrandProvider>
```

## テーマ（デザイン層）

### 構成

```text
src/themes/
├── types.ts            # Theme インターフェイス
├── registry.ts         # 名前 → Theme の解決
├── ThemeProvider.tsx   # useTheme()
└── default/
    ├── index.ts        # Theme オブジェクトの組み立て
    ├── theme.module.css  # このテーマのCSS
    ├── tokens.ts       # 色・パスなどのデザイントークン
    ├── page1/ page2/ page3/ page4/   # 各ページの Presenter
    └── PageHeader/
```

`src/themes/pixi-legacy/PixiApp.tsx` は PixiJS を使った旧アニメーションで、`Theme` インターフェイスには属さず `/animation` `/player` `/talks/[talkId]` から直接 dynamic import されています。

### Presenter はロジックを持たない

`src/components/pages/Page1.tsx` などはロジックとデザインの接続役です。ViewModel フックを呼び、結果を Presenter に渡すだけで、JSX は持ちません。

```tsx
export default function Page1({ view }: Props) {
  const { Page1: Presenter } = useTheme()
  usePage1ViewModel()
  return <Presenter view={view} />
}
```

Presenter が受け取る props は `src/themes/types.ts` の `PageNPresenterProps` に定義されています。テーマは「渡された値をどう見せるか」だけを考えれば済みます。

### CSSはグローバルに置かない

**テーマ固有のCSSは `src/themes/<name>/*.module.css` に置きます。** `src/pages/globals.css` には `body` リセットしか置きません。Tailwind のエントリと共通デザイントークンは `src/styles/tailwind.css` にまとめてあり、`src/pages/globals.css`（Pages Router）と `src/app/globals.css`（App Router）の両方がそれを import します。

グローバルCSSに書くと全テーマに漏れ、テーマを増やしたときにクラス名が衝突するためです。CSS Modules ならクラス名は自動でスコープされ、Next.js の「素のCSSは `_app.tsx` からしか import できない」制約も回避できます。

テーマ**外**のコンポーネント（`src/components/common/Loading.tsx` やページシェル）は、`Theme.classes` 経由でクラス名を受け取ります：

```tsx
const { classes } = useTheme()
<div className={`absolute inset-0 ${classes.contentFadeIn}`}>
```

### Brand はCSSクラス名を知らない

Brand が持つのは「意味」だけで、クラス名への変換はテーマの責務です。ロゴ形状がその例です：

```ts
// src/staticConfig/break.ts — brand 側は意味だけ
loadingLogoShape: 'circle'

// src/themes/default/index.ts — テーマ側がクラスに変換
logoShape: { circle: styles.logoCircle, none: '' }
```

Brand に生のクラス名を書くと、テーマを差し替えた瞬間に壊れます。

### Tailwind のスキャン対象に注意

Tailwind v4 には `content` 設定がなく、リポジトリ全体を自動でスキャンします。Presenter の Tailwind ユーティリティはこのスキャンではじめてCSSが生成されるため、**`@source` などで対象を狭めるとテーマのデザインが崩れます**（v3 時代に `content` から `src/themes` が漏れて全崩れした事例あり）。

### `src/styles/tailwind.css` の注意点

デザイントークンは `@theme` ブロックにあります。2点だけ落とし穴があります。

1. **コメント内に「アスタリスク + スラッシュ」の並びを書かないこと。** そこでコメントが終了し、後続の `@theme` が丸ごと無視されます。エラーにはならず、カスタムフォントや文字サイズが静かに効かなくなります。
2. **先頭の `--text-*: initial` を消さないこと。** v3 の `theme.fontSize` は完全上書きだったため `text-xs` は未定義でした。これを消すと v4 のデフォルト（12px）が復活し、`text-xs` を使っている箇所の文字サイズが変わります。

変更したら、生成CSSにクラスが出ているかを確認してください：

```bash
npm run build
cat .next/static/chunks/*.css | grep -c 'font-ryo-gothic-plusn'   # 0 なら @theme が壊れている
```

### テーマの切り替え

クエリパラメーターで指定できます。未知の名前を渡した場合は `default` にフォールバックします。

```
/break/talks/123?theme=default
```

### 新しいテーマを追加する

1. `src/themes/<name>/` を作り、`Page1`〜`Page4` の Presenter と `theme.module.css` を用意する
2. `src/themes/<name>/index.ts` で `Theme` オブジェクトを組み立てる（`classes` は必須）
3. `src/themes/types.ts` の `ThemeName` に名前を追加する
4. `src/themes/registry.ts` の `REGISTRY` に登録する

既存のテーマやページシェルには手を入れません。`Theme` インターフェイスを満たしていない場合は型エラーで検出されます。

## API型定義の自動生成

```bash
npm run rtk-query-codegen
```

## ビルド

```bash
npm run build  # プロダクションビルド
npm run start  # プロダクションサーバー起動
```

## イベントごとのアセット

`public/` ディレクトリ配下にイベントごとのフォルダがあります：

```
public/
├── cnds2024/       # CloudNativeDays 2024
├── cnds2025/       # CloudNativeDays 2025
├── o11yconjp2025/  # Observability Conference Japan 2025
├── pek2025/        # Platform Engineering Kaigi 2025
└── cndw2024/       # CloudNative Days Winter 2024
```

各イベントフォルダには背景画像、BGMなどのアセットを配置します。
