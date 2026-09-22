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
    src: 'https://im-file.emtec.tv/pek2026/mercari.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/pek2026/softbank.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/pek2026/aws.mp4',
    type: 'video/mp4',
  },
])

export const breakConfig = {
  base: {
    eventAbbr: 'pek2026',
    loadingIconSrc: '/pek2026/logo-bg-white.png',
    loadingEnabled: true,
    loadingLogoShape: 'circle',
    backgroundSrc: '/pek2026/background.png',
    audioSrcs: [
      '/pek2026/bgm/01-busy-city-streets.mp3',
      '/pek2026/bgm/02-cnk-theme-city-arrange.mp3',
      '/pek2026/bgm/03-rhodes-lounge.mp3',
    ],
    hashTag: {
      all: 'PEK2026',
      break: '',
    },
    useHashTagAsTrackName: false,
    defaultAvatarSrc: '/pek2026/logo-bg-white.png',
    // NOTE: ヘッダは高さ140px・width:450px/height:auto で描画されるので
    // 横長のタイトル画像を指定すること
    headerLogoSrc: '/pek2026/title.png',
    // 公式サイトの primary-700
    headerBackgroundColor: '#005a93',
  },
  page1: {
    seconds: 32.5,
    // 公式サイトの primary-500
    cardBackgroundColor: '#0087d7',
    cardTextColor: '#ffffff',
  },
  page2: {
    seconds: 32.5,
    // 公式サイトのタイムテーブル列ヘッダ配色 (Hall=紫 / Room A=青 / Room B=橙)
    trackColors: ['#5f5f9d', '#0087d7', '#ed951d'],
  },
  page3: {
    alias: 'pek2026/info',
    images: breakImages,
    trackImages: breakTrackImages,
    secondsPerImage: 10,
  },
  page4: {
    playlist: breakPlaylist,
  },
} as const
