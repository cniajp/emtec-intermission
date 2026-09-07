import { Speaker } from './types'

/**
 * Go Conference 2026 (2026-09-11 / 中野セントラルパークカンファレンス)
 * 出典: https://github.com/GoCon/2026
 *   - src/components/timetable/data.json (Sessionize 由来)
 *   - src/components/timetable/manualSessions.ts (基調講演・スポンサー)
 * 登壇者画像はすべて public/gocon2026/speakers/ に保存している
 *   - id 2-4 (スポンサーセッション): gocon.jp のロゴ画像
 *   - それ以外: Sessionize (cdn.sessionize.com) の画像を <X の ID>.<ext> で保存
 *     (X 未設定の登壇者は <id>.<ext>)
 */
export const speakers: Speaker[] = [
  {
    id: 1,
    name: 'Atsuki Seo',
    company: '弓削商船高等専門学校 情報工学科 教員  / ソフトウェアエンジニア',
    avatarUrl: '/gocon2026/speakers/atsuki_seo.jpg',
  },
  {
    id: 2,
    name: '八谷航太（ヤタガイ コウタ）',
    company: '株式会社ミラティブ',
    avatarUrl: '/gocon2026/speakers/mirativ.jpg',
  },
  {
    id: 3,
    name: 'Takeshi Watanabe',
    company: '株式会社エウレカ',
    avatarUrl: '/gocon2026/speakers/eureka.jpeg',
  },
  {
    id: 4,
    name: '田口 健介',
    company: 'エムスリー株式会社',
    avatarUrl: '/gocon2026/speakers/m3.png',
  },
  {
    id: 5,
    name: 'goccy',
    company: 'Software Engineer',
    avatarUrl: '/gocon2026/speakers/goccy54.jpg',
  },
  {
    id: 6,
    name: 'budougumi0617',
    company: 'LayerX Inc, Software Engineer, Engineering Manager',
    avatarUrl: '/gocon2026/speakers/budougumi0617.jpg',
  },
  {
    id: 7,
    name: 'convto',
    company: '株式会社LayerX',
    avatarUrl: '/gocon2026/speakers/convto.jpg',
  },
  {
    id: 8,
    name: 'ymotongpoo',
    company: 'Staff Developer Advocate at Grafana Labs',
    avatarUrl: '/gocon2026/speakers/ymotongpoo.jpg',
  },
  {
    id: 9,
    name: '國分 竜二',
    company: '合同会社DMM.comオンラインサロン開発部ATG',
    avatarUrl: '/gocon2026/speakers/9.png',
  },
  {
    id: 10,
    name: 'Takeru Hayasaka',
    company: 'BBSakura Networks.Inc, Senior Software Engineer',
    avatarUrl: '/gocon2026/speakers/takemioIO.jpg',
  },
  {
    id: 11,
    name: 'Hajime Hoshi',
    company: 'CTO at Odencat Inc.',
    avatarUrl: '/gocon2026/speakers/hajimehoshi.png',
  },
  {
    id: 12,
    name: 'Tatsuya Kaneko',
    company: '株式会社PR TIMES CTO',
    avatarUrl: '/gocon2026/speakers/catatsuy.png',
  },
  {
    id: 13,
    name: 'ikura-hamu',
    company: '東京科学大学デジタル創作同好会traP',
    avatarUrl: '/gocon2026/speakers/ikura_hamu.png',
  },
  {
    id: 14,
    name: '倉澤大樹 Hiroki Kurasawa',
    company: '株式会社ZOZOバックエンドエンジニア',
    avatarUrl: '/gocon2026/speakers/kurasawah.jpg',
  },
  {
    id: 15,
    name: 'Takuya Sakamoto',
    company: 'Yappli.Inc,server side developer',
    avatarUrl: '/gocon2026/speakers/mohvuba.jpg',
  },
  {
    id: 16,
    name: 'Yusa Matsuda',
    company: 'REALITY株式会社',
    avatarUrl: '/gocon2026/speakers/16.jpg',
  },
  {
    id: 17,
    name: 'Senoue',
    company: 'Sendai.go',
    avatarUrl: '/gocon2026/speakers/senoue.jpg',
  },
  {
    id: 18,
    name: 'Koki Narumi',
    company: 'ANDPAD Inc. | Software Engineer',
    avatarUrl: '/gocon2026/speakers/sunecosuri.png',
  },
  {
    id: 19,
    name: 'TinyGo Keeb',
    company: 'TinyGo Keeb',
    avatarUrl: '/gocon2026/speakers/ken5owata.png',
  },
  {
    id: 20,
    name: 'Hiromu Nakamura',
    company: 'LayerX, Inc.',
    avatarUrl: '/gocon2026/speakers/po3rin.jpg',
  },
  {
    id: 21,
    name: 'つばさ',
    company: '九州工業大学大学院',
    avatarUrl: '/gocon2026/speakers/21.jpg',
  },
  {
    id: 22,
    name: 'Go Connect',
    company: 'Community',
    avatarUrl: '/gocon2026/speakers/22.svg',
  },
]
