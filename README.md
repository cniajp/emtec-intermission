# EMTEC Intermission

CloudNativeDaysなどの技術カンファレンスで使用されるインターミッション（休憩時間の案内）画面を生成・表示するWebアプリケーションです。

## 概要

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

## セットアップ

### 必要要件

- Node.js 18以上
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

## 使い方

### OBS連携

`/break-dk/obs` や `/break/obs` ページはOBS用です。クエリパラメータで設定を指定できます：

```
/break-dk/obs?trackId=1&trackName=TrackA&confDay=1
```

### クエリパラメータでの設定上書き

ほとんどの設定はURLクエリパラメータで上書き可能です：

```
/break-dk/talks/123?transTimePage1=30&debug=true
```

## 開発

### API型定義の自動生成

```bash
npm run rtk-query-codegen
```

### テスト

```bash
npm run test          # テスト実行
npm run test:update   # スナップショット更新
npm run test:coverage # カバレッジ取得
```

### ビルド

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

## ライセンス

このプロジェクトはCloudNative Days実行委員会によって管理されています。
