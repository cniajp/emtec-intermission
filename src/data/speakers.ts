import { Speaker } from './types'

/**
 * Hono Conference in Tokyo 2026 (2026-10-11 / LINEヤフー紀尾井町オフィス)
 * 出典: https://fortee.jp/honoconf-2026/api/timetable と https://honoconf.dev/2026 (2026-10-06 取得)
 * 登壇者画像はすべて public/honoconf2026/speakers/ に保存している
 *   - fortee の登壇者: <X の ID>.<ext>
 *   - ゲスト登壇者: 公式サイトの画像ファイル名
 *   - 画像が無いスポンサー登壇者と id 0 の運営は logo.png
 * fortee には所属が無いため、company は公式サイトに記載のあるゲストのみ
 */
export const speakers: Speaker[] = [
  {
    id: 0,
    name: '運営',
    company: '',
    avatarUrl: '/honoconf2026/logo.png',
  },
  {
    id: 1,
    name: 'ばら / bara',
    company: '',
    avatarUrl: '/honoconf2026/speakers/EthicalTx.jpg',
  },
  {
    id: 2,
    name: 'mental-space',
    company: '',
    avatarUrl: '/honoconf2026/speakers/9BBLoiWNcz44090.jpg',
  },
  {
    id: 3,
    name: 'asahi',
    company: '',
    avatarUrl: '/honoconf2026/speakers/ashunar0.jpg',
  },
  {
    id: 4,
    name: 'Gen Tamura',
    company: '',
    avatarUrl: '/honoconf2026/logo.png',
  },
  {
    id: 5,
    name: 'kosui',
    company: '',
    avatarUrl: '/honoconf2026/logo.png',
  },
  {
    id: 6,
    name: '田中博悠',
    company: '',
    avatarUrl: '/honoconf2026/speakers/tanahiro2010.jpg',
  },
  {
    id: 7,
    name: 'cochumo',
    company: '',
    avatarUrl: '/honoconf2026/speakers/cochumo_1128.jpg',
  },
  {
    id: 8,
    name: 'こまもか/Comamoca',
    company: '',
    avatarUrl: '/honoconf2026/speakers/Comamoca_.png',
  },
  {
    id: 9,
    name: '影白/KageShiron',
    company: '',
    avatarUrl: '/honoconf2026/speakers/KageShiron.jpg',
  },
  {
    id: 10,
    name: 'Kanon',
    company: '',
    avatarUrl: '/honoconf2026/speakers/ysknsid25.jpg',
  },
  {
    id: 11,
    name: 'Yusuke Wada',
    company: 'Cloudflare, Inc.',
    avatarUrl: '/honoconf2026/speakers/yusuke-wada.png',
  },
  {
    id: 12,
    name: 'Taku Amano',
    company: '',
    avatarUrl: '/honoconf2026/speakers/taku-amano.png',
  },
  {
    id: 13,
    name: 'watany',
    company: 'NTT',
    avatarUrl: '/honoconf2026/speakers/watany.png',
  },
  {
    id: 14,
    name: 'Aditya Mathur',
    company: 'Sentry',
    avatarUrl: '/honoconf2026/speakers/aditya-mathur.png',
  },
]
