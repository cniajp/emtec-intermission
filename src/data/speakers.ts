import { Speaker } from './types'

/**
 * Platform Engineering Kaigi 2026 (2026-09-26 / 中野セントラルパークカンファレンス)
 * 出典: https://www.cnia.io/pek2026/sessions/ の各セッション詳細ページ (2026-09-18 取得)
 * 登壇者画像はすべて public/pek2026/speakers/ に保存している
 *   - X の ID がある登壇者: <X の ID>.<ext>
 *   - X 未設定の登壇者: サイトの画像ファイル名 (uuid).<ext>
 *   - 画像が無い登壇者 (島村 純平) と id 0 の運営は logo-bg-white.png
 */
export const speakers: Speaker[] = [
  {
    id: 0,
    name: '運営',
    company: '',
    avatarUrl: '/pek2026/logo-bg-white.png',
  },
  {
    id: 1,
    name: 'Kaspar von Grünberg',
    company: 'Author, Thinking in Platforms',
    avatarUrl: '/pek2026/speakers/kaspar.png',
  },
  {
    id: 2,
    name: '河野智則',
    company: '株式会社リンクアンドモチベーション',
    avatarUrl: '/pek2026/speakers/dad4370b-55a2-4d74-99ce-1e9482a9b59b.png',
  },
  {
    id: 3,
    name: '小野 大器',
    company: 'enechain',
    avatarUrl: '/pek2026/speakers/taiki45.png',
  },
  {
    id: 4,
    name: '加藤 泰隆',
    company: '株式会社スリーシェイク',
    avatarUrl: '/pek2026/speakers/ma_anago.jpg',
  },
  {
    id: 5,
    name: '木嶋幸子',
    company: 'レッドハット',
    avatarUrl: '/pek2026/speakers/SachikoKijima.png',
  },
  {
    id: 6,
    name: 'tkuchiki',
    company: '株式会社メルペイ',
    avatarUrl: '/pek2026/speakers/tkuchiki.jpg',
  },
  {
    id: 7,
    name: '中井 綾一',
    company: '株式会社ログラス',
    avatarUrl: '/pek2026/speakers/elmodev09.jpg',
  },
  {
    id: 8,
    name: '三改木 裕矢',
    company: 'ソフトバンク株式会社',
    avatarUrl: '/pek2026/speakers/ef97480d-1d5e-44c6-9637-e7b0b6571f72.png',
  },
  {
    id: 9,
    name: '河村 信宏',
    company: 'ソフトバンク株式会社',
    avatarUrl: '/pek2026/speakers/f06c75e7-244e-49b5-b047-6405ed45d072.png',
  },
  {
    id: 10,
    name: 'ハオ',
    company: 'テナブルネットワークセキュリティジャパン',
    avatarUrl: '/pek2026/speakers/d20050fb-df6c-4dc3-8504-a5f24ea4511b.jpg',
  },
  {
    id: 11,
    name: '安部 修平',
    company: 'ウェルスナビ株式会社',
    avatarUrl: '/pek2026/speakers/sabe23x.jpg',
  },
  {
    id: 12,
    name: '大戸 一希',
    company: 'Turing 株式会社',
    avatarUrl: '/pek2026/speakers/kazu_kun0716.webp',
  },
  {
    id: 13,
    name: '杉本 浩平',
    company: '株式会社MIXI',
    avatarUrl: '/pek2026/speakers/kohbis.jpg',
  },
  {
    id: 14,
    name: '小西 杏典',
    company: 'アマゾンウェブサービスジャパン合同会社',
    avatarUrl: '/pek2026/speakers/_konippi.jpg',
  },
  {
    id: 15,
    name: '松岡 雄地',
    company: 'アマゾンウェブサービスジャパン合同会社',
    avatarUrl: '/pek2026/speakers/16b86461-d65b-4766-b5c6-47d2f50da82a.jpg',
  },
  {
    id: 16,
    name: '近藤 智文',
    company: '株式会社サイバーエージェント',
    avatarUrl: '/pek2026/speakers/tomokon_0314.png',
  },
  {
    id: 17,
    name: '長井 佑太',
    company: '株式会社サイバーエージェント',
    avatarUrl: '/pek2026/speakers/a6b6e3f6-dbe7-453c-a738-cec564a74fdb.jpg',
  },
  {
    id: 18,
    name: '米山兼治',
    company: 'ソニー株式会社',
    avatarUrl: '/pek2026/speakers/7d9fbb78-6572-4dd2-958a-71a310f57d32.jpg',
  },
  {
    id: 19,
    name: '荒井 良太',
    company: '株式会社メルカリ',
    avatarUrl: '/pek2026/speakers/ryot_a_rai.jpg',
  },
  {
    id: 20,
    name: '山口能迪',
    company: 'Grafana Labs',
    avatarUrl: '/pek2026/speakers/ymotongpoo.png',
  },
  {
    id: 21,
    name: '杉田寿憲',
    company: '株式会社LegalOn Technologies',
    avatarUrl: '/pek2026/speakers/toshi0607.jpg',
  },
  {
    id: 22,
    name: 'azrsh',
    company: '株式会社メルカリ',
    avatarUrl: '/pek2026/speakers/a2r5h.png',
  },
  {
    id: 23,
    name: '鈴木勝史',
    company: '株式会社スリーシェイク',
    avatarUrl: '/pek2026/speakers/masasuz.jpg',
  },
  {
    id: 24,
    name: '角井 暖',
    company: '株式会社アンドパッド',
    avatarUrl: '/pek2026/speakers/cass7ius.jpg',
  },
  {
    id: 25,
    name: 'イ サンヒョック',
    company: 'レバレジーズ株式会社',
    avatarUrl: '/pek2026/speakers/hiyotsuku_lee.jpg',
  },
  {
    id: 26,
    name: '島村 純平',
    company: 'KINTOテクノロジーズ',
    avatarUrl: '/pek2026/logo-bg-white.png',
  },
  {
    id: 27,
    name: '増田 圭佑',
    company: 'Sansan株式会社',
    avatarUrl: '/pek2026/speakers/f183fc6f-dc27-453d-9b81-8a4e6ae3c0ff.webp',
  },
]
