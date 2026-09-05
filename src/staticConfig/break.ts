import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

const breakImages: string[] = ['info_001.jpg']

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  // 1: [{ position: 2, src: 'info_002.jpg' }],
  // 2: [{ position: 2, src: 'info_003.jpg' }],
  // 3: [{ position: 2, src: 'info_004.jpg' }],
}

const breakPlaylist: Playlist = toPlaylist([
  // {
  //   src: 'https://im-file.emtec.tv/kinoko2026/hokan.mp4',
  //   type: 'video/mp4',
  // }
])

export const breakConfig = {
  base: {
    loadingIconSrc: '/pde2026/logo-bg-white.png',
    loadingEnabled: true,
    loadingLogoShape: 'circle',
    backgroundSrc: '/pde2026/background.png',
    audioSrc: '/pde2026/bgm.mp3',
    hashTag: {
      all: 'PdEConf',
      break: 'PdEConf_Hall',
    },
    useHashTagAsTrackName: true,
    defaultAvatarSrc: '/pde2026/logo-bg-white.png',
    // NOTE: ヘッダは高さ140px・width:450px/height:auto で描画されるので
    // 横長のタイトル画像を指定すること
    headerLogoSrc: '/pde2026/title.png',
    headerBackgroundColor: '#763F03',
  },
  page1: {
    seconds: 32.5,
  },
  page2: {
    seconds: 32.5,
  },
  page3: {
    alias: 'pde2026/info',
    images: breakImages,
    trackImages: breakTrackImages,
    secondsPerImage: 10,
  },
  page4: {
    playlist: breakPlaylist,
  },
} as const
