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

## 使い方

1. トップページ（`/`）にアクセス
2. データソース（Dreamkast版 or 静的データ版）を選択
3. Day（Day 0, 1, 2...）を選択
4. 表示したいセッションを選択

メニューからOBS連携を選択すると、OBSにインポートできるシーンコレクションのJSONファイルをダウンロードできます。

## 開発

開発者向けの詳細情報は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

このプロジェクトはEMTECによって管理されています。
