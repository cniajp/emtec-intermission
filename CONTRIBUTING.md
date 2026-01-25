# 開発ガイド

このドキュメントは開発者向けの情報をまとめています。

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
