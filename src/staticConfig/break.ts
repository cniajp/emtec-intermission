import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

// TODO: 告知画像が届いたら public/jisaba2026/info/ に置いて列挙する
// (空の間は Page3 をスキップして次のページへ進む)
const breakImages: string[] = []

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  // 1: [{ position: 2, src: 'info_002.jpg' }],
  // 2: [{ position: 2, src: 'info_003.jpg' }],
}

// TODO: CM 動画が届いたら追加する
const breakPlaylist: Playlist = toPlaylist([])

export const breakConfig = {
  base: {
    eventAbbr: 'jisaba2026',
    loadingIconSrc: '/jisaba2026/logo.png',
    loadingEnabled: true,
    loadingLogoShape: 'circle',
    // 公式提供の背景（クリーム色のドット地＋下端に紺の帯）
    backgroundSrc: '/jisaba2026/background.png',
    // TODO: 自鯖缶用の BGM が届いたら public/jisaba2026/bgm/ に置いて差し替える
    // (仮: Hono Conf 2026 の BGM を流用)
    audioSrcs: ['/honoconf2026/bgm/gocon2026_bgm.mp3'],
    audioShuffle: true,
    audioFadeSeconds: 0,
    audioFadeOutBeforeCm: true,
    hashTag: {
      all: 'jisabakan',
      break: '',
    },
    useHashTagAsTrackName: false,
    defaultAvatarSrc: '/jisaba2026/logo.png',
    // NOTE: ヘッダは高さ140px・width:450px/height:auto で描画されるので
    // 横長のタイトル画像を指定すること
    // 公式サイトの横長ロゴ (198x64 の透過画像を4倍に拡大。TODO: 高解像度版が届いたら差し替える)
    headerLogoSrc: '/jisaba2026/title.png',
    headerLogoShadow: false,
    // 背景がクリーム色なので公式サイトの navy-800
    headerTextColor: '#0e223d',
    headerBackgroundColor: '#fbf6ef',
  },
  page1: {
    seconds: 32.5,
    // 公式サイトのアクセントカラー (orange-500)
    cardBackgroundColor: '#ea7b24',
    cardTextColor: '#ffffff',
  },
  page2: {
    seconds: 32.5,
    // 1トラック。公式サイトの orange-500
    trackColors: ['#ea7b24'],
  },
  page3: {
    alias: 'jisaba2026/info',
    images: breakImages,
    trackImages: breakTrackImages,
    secondsPerImage: 10,
  },
  page4: {
    playlist: breakPlaylist,
  },
} as const
