# CLAUDE.md - AI開発アシスタント向けガイド

このファイルは、AI開発アシスタントがこのプロジェクトで効率的に作業するための指示書です。

## プロジェクト概要

**EMTEC Intermission** は、CloudNativeDaysなどの技術カンファレンスで使用されるインターミッション（休憩時間の案内）画面を生成・表示するWebアプリケーションです。

### 主な目的
- セッション間の休憩時に次のセッション情報を表示
- BGMとアニメーションで視覚的に魅力的なインターミッションを提供
- OBS（配信ソフト）に組み込んで使用

## 技術スタック

- **Next.js 15** (App Router + Pages Router併用)
- **React 19**
- **TypeScript**
- **PixiJS** - 2Dアニメーション
- **Redux Toolkit (RTK Query)** - API状態管理
- **Tailwind CSS**
- **Video.js** - 動画再生
- **next-pwa** - PWA対応

## アーキテクチャ

### データソースの二重構造

このプロジェクトは**2つの異なるデータソース**に対応しています：

1. **Dreamkast API連携** (`/break-dk/*`)
   - CloudNativeDaysのイベント管理システムのAPIからリアルタイムでデータ取得
   - Redux Toolkit Queryを使用
   - ファイル: `src/pages/break-dk/`, `src/components/hooks/useGetTalksAndTracks.ts`

2. **静的TSファイル** (`/break/*`)
   - `src/data/talks.ts`, `src/data/speakers.ts`, `src/data/tracks.ts` からデータ取得
   - APIが利用できない場合のフォールバック
   - ファイル: `src/pages/break/`

### ルーティング構造

```
/                           # トップページ（メニュー選択）
├── /break-dk/menu/[confDay]   # Dreamkast版メニュー（Day 0, 1, 2...）
├── /break-dk/talks/[talkId]   # Dreamkast版インターミッション表示
├── /break-dk/obs               # Dreamkast版OBS用ページ
├── /break/menu/[confDay]       # 静的データ版メニュー
├── /break/talks/[talkId]       # 静的データ版インターミッション表示
└── /break/obs                  # 静的データ版OBS用ページ
```

## 重要なコンポーネント

### インターミッション表示の構造

インターミッション画面は**4ページ構成**のアニメーションで構成されています：

1. **Page1** (`src/components/Page1.tsx`)
   - 次のセッション情報（UPCOMING SESSION）を表示
   - タイトル、登壇者、所属、時間、概要を表示

2. **Page2** (`src/components/Page2.tsx`)
   - 登壇者のアバター画像を表示
   - アバターがない場合はプレースホルダーを使用

3. **Page3** (`src/components/Page3.tsx`)
   - 追加情報やタイムテーブルを表示

4. **Page4** (`src/components/Page4.tsx`)
   - 最終ページ（プロジェクトによって使用有無が異なる）

### ページ遷移の仕組み

- **PageContext** (`src/components/models/pageContext.tsx`) でページ状態を管理
- 各ページは設定された時間（`config.transTimePageN`）後に自動遷移
- BGMの長さと同期するように時間を調整

### アニメーション

- **PixiApp** (`src/components/PixiApp.tsx`)
  - PixiJSを使用した2Dグラフィックスレンダリング
  - ベジェ曲線によるスムーズなイージング効果
  - BGMの再生とフェードアウト制御

## 設定管理

### 環境変数 (`.env.production`, `.env.development`)

```bash
NEXT_PUBLIC_API_BASE_URL       # DreamkastのAPIエンドポイント
NEXT_PUBLIC_EVENT_ABBR         # 静的データ用イベント略称
NEXT_PUBLIC_DK_EVENT_ABBR      # Dreamkast用イベント略称
NEXT_PUBLIC_TRANS_TIME_PAGE1   # Page1の表示時間（秒）
NEXT_PUBLIC_TRANS_TIME_PAGE2   # Page2の表示時間（秒）
NEXT_PUBLIC_TRANS_TIME_PAGE3   # Page3の表示時間（秒）
NEXT_PUBLIC_DEBUG              # デバッグモード（'true' で有効）
NEXT_PUBLIC_EXCLUDED_TALKS     # 除外するトークID（カンマ区切り）
```

### Config (`src/config.ts`)

- 環境変数を型安全に管理
- `extendConfig()` でクエリパラメータから動的に設定を上書き可能

## イベントごとのアセット管理

`public/` ディレクトリ配下にイベントごとのフォルダがあります：

```
public/
├── cnds2024/       # CloudNativeDays 2024
├── cnds2025/       # CloudNativeDays 2025
├── o11yconjp2025/  # Observability Conference Japan 2025
├── pek2025/        # Platform Engineering Kaigi 2025
└── cndw2024/       # CloudNative Days Winter 2024
```

各イベントフォルダには以下を含みます：
- `background.webp` / `background.png` - 背景画像
- `*_intermission.mp3` - BGM
- その他イベント固有のアセット

## 開発時の重要な注意事項

### 1. データソースの識別

コードを修正する際は、対象が以下のどちらかを明確にしてください：
- **Dreamkast API版** (`/break-dk/*`) - API連携が必要
- **静的データ版** (`/break/*`) - ローカルデータのみ

### 2. TalkViewモデル

`src/components/models/talkView.ts` に `TalkView` と `MenuView` クラスがあります：
- データソースの違いを吸収する抽象化レイヤー
- 静的メソッド `withoutDk()` で静的データ版を、コンストラクタで Dreamkast版を生成

### 3. BGMと画面遷移の同期

- BGMの長さに合わせて各ページの表示時間を調整
- 合計時間 = `transTimePage1 + transTimePage2 + transTimePage3`
- PixiAppの `duration` 変数も適宜調整が必要

### 4. フォント

- **video-cond** - 時計表示用（Adobe Fonts）
- **din-2014** - 英語ラベル用（Adobe Fonts）
- **ryo-gothic-plusn** - 日本語テキスト用（Adobe Fonts）

フォントは各ページで `<link>` タグで読み込まれています。

### 5. デバッグモード

`NEXT_PUBLIC_DEBUG='true'` を設定すると：
- 動画プレイヤーのコントロールが表示される
- ページ遷移ボタンが表示される
- キャッシュ更新ボタンが表示される

### 6. PWA対応

- Service Workerは `src/service-worker.js`
- 動画ファイルのキャッシュ管理を行っている
- OBS用途では動画の事前キャッシュが重要

## API自動生成

Dreamkast APIのTypeScript型定義は自動生成されています：

```bash
npm run rtk-query-codegen
```

- 設定: `rtk-query-codegen-openapi.config.ts`
- 生成先: `src/generated/dreamkast-api.generated.ts`
- OpenAPI仕様からRTK Queryのエンドポイントとフックを生成

## コーディング規約

### ファイル命名
- React コンポーネント: PascalCase (`Page1.tsx`, `PixiApp.tsx`)
- ユーティリティ: camelCase (`time.ts`, `utils.ts`)
- データファイル: camelCase (`talks.ts`, `speakers.ts`)

### コンポーネント構成
- 1ファイルに複数のコンポーネントを含めることがある（Page1.tsx など）
- プライベートコンポーネントは同ファイル内に定義
- 再利用可能なコンポーネントは別ファイルに分離

### 型定義
- `Optional<T>` = `T | null` - null許容型（`src/utils/types.ts`）
- API型は自動生成されたものを使用
- ローカルデータ型は `src/data/types.ts` で管理

## よくあるタスク

### 新しいイベントを追加する場合

1. `public/` に新しいイベントフォルダを作成
2. 必要なアセット（背景画像、BGM）を配置
3. `.env.production` の環境変数を更新
4. 必要に応じて `src/data/*.ts` を更新（静的データ版の場合）

### ページデザインを変更する場合

1. `src/components/Page1.tsx` などの対象ページを編集
2. Tailwind CSSクラスで調整
3. 必要に応じてカスタムフォントやアニメーションを追加

### BGMの長さを変更する場合

1. 新しいBGMファイルを `public/[event]/` に配置
2. `.env.production` の `NEXT_PUBLIC_TRANS_TIME_PAGE*` を調整
3. `src/components/PixiApp.tsx` の `duration` を更新
4. 合計時間がBGMの長さと一致するように調整

### APIエンドポイントを追加する場合

1. `rtk-query-codegen-openapi.config.ts` を更新（必要に応じて）
2. `npm run rtk-query-codegen` を実行
3. 生成されたフックを使用してコンポーネントを実装

## トラブルシューティング

### ページが表示されない
- `config.debug = true` でデバッグモードを有効化
- ブラウザのコンソールでエラーを確認
- データソース（API / 静的データ）が正しく読み込まれているか確認

### BGMが再生されない
- ブラウザのAutoplay Policyを確認（muted属性が必要な場合がある）
- ファイルパスが正しいか確認
- 事前に手動で再生すると動作する場合がある

### アニメーションがカクつく
- PixiJSのフレームレート設定を確認
- 画像サイズを最適化
- ブラウザのハードウェアアクセラレーションを確認

### APIからデータが取得できない
- CORSの設定を確認
- `NEXT_PUBLIC_API_BASE_URL` が正しいか確認
- ネットワークタブでAPIリクエストの状態を確認

## テスト

```bash
npm run test          # テスト実行
npm run test:update   # スナップショット更新
npm run test:coverage # カバレッジ取得
```

## ビルドとデプロイ

```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run start  # プロダクションサーバー起動
```

## その他の重要情報

### OBS連携

- `/break-dk/obs` や `/break/obs` ページはOBS用
- クエリパラメータで `trackId`, `trackName`, `confDay` を指定
- 自動的にそのトラックの次のセッション情報を表示

### クエリパラメータでの設定上書き

ほとんどの設定はURLクエリパラメータで上書き可能：
```
/break-dk/talks/123?transTimePage1=30&debug=true
```

これにより、ビルドせずに設定を変更できます。

---

## AI開発アシスタントへの指示

このプロジェクトで作業する際は：

1. **データソースを確認**: `/break-dk/` か `/break/` のどちらを対象にしているか確認
2. **両方に影響がないか検討**: 共通コンポーネントの変更は両方に影響する
3. **アセットパスを確認**: イベント名を含むパスが正しいか確認
4. **型安全性を維持**: TypeScriptの型を適切に使用
5. **BGMとの同期を考慮**: 時間調整が必要な変更の場合は注意
6. **レスポンシブ対応は不要**: 基本的に 1920x1080 固定（OBS用）
7. **デバッグモードを活用**: 開発時は `debug=true` で作業

変更を加える前に、影響範囲を確認してください。
