import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

const breakImages: string[] = []

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  // 1: [{ position: 2, src: 'info_002.jpg' }],
  // 2: [{ position: 2, src: 'info_003.jpg' }],
  // 3: [{ position: 2, src: 'info_004.jpg' }],
}

const breakPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/kinoko2026/hokan.mp4',
    type: 'video/mp4',
  },
])

export const breakConfig = {
  base: {
    eventAbbr: 'gocon2026',
    loadingIconSrc: '/gocon2026/logo-bg-white.jpg',
    loadingEnabled: true,
    loadingLogoShape: 'circle',
    backgroundSrc: '/gocon2026/background.jpg',
    audioSrc: '/gocon2026/bgm.mp3',
    hashTag: {
      all: 'gocon',
      break: '',
    },
    useHashTagAsTrackName: false,
    defaultAvatarSrc: '/gocon2026/logo-bg-white.jpg',
    // NOTE: ヘッダは高さ140px・width:450px/height:auto で描画されるので
    // 横長のタイトル画像を指定すること
    headerLogoSrc: '/gocon2026/title.png',
    headerBackgroundColor: '#103972',
  },
  page1: {
    seconds: 32.5,
    cardBackgroundColor: '#103972',
    cardTextColor: '#ffffff',
  },
  page2: {
    seconds: 32.5,
    trackColors: ['#f14e35', '#387c61', '#e5b73d'],
  },
  page3: {
    alias: 'gocon2026/info',
    images: breakImages,
    trackImages: breakTrackImages,
    secondsPerImage: 10,
  },
  page4: {
    playlist: breakPlaylist,
  },
} as const
