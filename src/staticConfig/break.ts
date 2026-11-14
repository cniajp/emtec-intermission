import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

// Page3 で順に表示する告知スライド (public/jisaba2026/info/)。空にすると Page3 をスキップする
const breakImages: string[] = [
  // 企業スポンサー → 個人スポンサー
  'sponsor_corporate.png',
  'sponsor_individual.png',
]

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  // 1: [{ position: 2, src: 'info_002.jpg' }],
  // 2: [{ position: 2, src: 'info_003.jpg' }],
}

// 自鯖缶 CM
const breakPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/jisabakan2026/jisabakan_cm.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/jisabakan2026/EMTEC_CM_30s_FHD_v13.mp4',
    type: 'video/mp4',
  },
])

export const breakConfig = {
  base: {
    eventAbbr: 'jisaba2026',
    loadingIconSrc: '/jisaba2026/logo.png',
    loadingEnabled: true,
    loadingLogoShape: 'circle',
    // 公式提供の背景（クリーム色のドット地＋下端に紺の帯）
    backgroundSrc: '/jisaba2026/background.png',
    // 公式提供の BGM (Homelab_night, 約168秒。末尾で先頭に戻ってループ再生)
    audioSrcs: ['/jisaba2026/bgm/homelab_night.mp3'],
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
    // 公式サイトの横長ロゴの原本 (2259x728 の透過 PNG) を高さ 440px に縮小したもの
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
    // 同じ枠の4本を見分けやすいよう、公式サイトの色を1本ずつ交互に使う
    // (orange-500 / navy-700 / orange-700 / navy-600。文字は白)
    cardRotationBackgroundColors: ['#ea7b24', '#1a3355', '#9a3f0b', '#2a4670'],
    cardTextColor: '#ffffff',
  },
  page2: {
    seconds: 32.5,
    // 1トラック。公式サイトの orange-500
    trackColors: ['#ea7b24'],
    // 1トラックで全カードが同じラベルになるので出さない
    showTrackLabel: false,
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
