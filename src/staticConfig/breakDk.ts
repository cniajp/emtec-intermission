import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

const breakDkImages: string[] = [
  'info_002.jpg',
  'info_003.jpg',
  'info_004.jpg',
  'info_005.jpg',
  'info_006.jpg',
  'info_007.jpg',
  'info_008.jpg',
  'info_009.jpg',
  'info_010.jpg',
]

const breakDkTrackImages: TrackImageInserts = {}

const breakDkPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/cndw2026/HireRoo.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/cndw2026/EMTEC_CM_30s_FHD_v13.mp4',
    type: 'video/mp4',
  },
  // {
  //   src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //   type: 'video/mp4',
  // },
])

export const breakDkConfig = {
  base: {
    eventAbbr: 'cndw2026',
    loadingIconSrc: '/cndw2026/logo.png',
    loadingEnabled: true,
    loadingLogoShape: 'none',
    backgroundSrc: '/cndw2026/new/background.jpg',
    audioSrcs: ['/cndw2026/bgm.mp3'],
    audioShuffle: true,
    audioFadeSeconds: 3,
    audioFadeOutBeforeCm: true,
    hashTag: {
      all: 'cloudnativekaigi',
      break: 'cloudnativekaigi_',
    },
    useHashTagAsTrackName: false,
    defaultAvatarSrc: '/cndw2026/logo.png',
    // NOTE: ヘッダは高さ140px・width:450px/height:auto で描画されるので
    // 横長のタイトル画像を指定すること
    headerLogoSrc: '/cndw2026/title.png',
    headerLogoShadow: false,
    headerTextColor: '#ffffff',
    headerBackgroundColor: '#763F03',
  },
  page1: {
    seconds: 32.5,
    cardBackgroundColor: '#387c61',
    cardRotationBackgroundColors: [],
    cardTextColor: '#ffffff',
  },
  page2: {
    seconds: 32.5,
    trackColors: ['#f14e35', '#387c61', '#e5b73d'],
    showTrackLabel: true,
  },
  page3: {
    alias: 'cndw2026/info',
    images: breakDkImages,
    trackImages: breakDkTrackImages,
    secondsPerImage: 10,
  },
  page4: {
    playlist: breakDkPlaylist,
  },
} as const
