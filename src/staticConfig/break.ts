import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

const breakImages: string[] = ['info_001.jpg']

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  1: [{ position: 2, src: 'info_002.jpg' }],
  2: [{ position: 2, src: 'info_003.jpg' }],
  3: [{ position: 2, src: 'info_004.jpg' }],
}

const breakPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/kinoko2026/hokan.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/mybest.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/collabostyle.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/tenshokudraft.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/kakehashi.mp4',
    type: 'video/mp4',
  },
])

export const breakConfig = {
  base: {
    loadingIconSrc: '/kinoko2026/logo-bg-white.png',
    loadingEnabled: true,
    loadingLogoClassName: 'loading-logo-circle',
    backgroundSrc: '/kinoko2026/background.jpg',
    audioSrc: '/kinoko2026/bgm.mp3',
    hashTag: {
      all: 'きのこ2026',
      break: 'きのこセッション',
    },
    useHashTagAsTrackName: true,
    defaultAvatarSrc: '/kinoko2026/logo-bg-white.png',
  },
  page3: {
    alias: 'kinoko2026/info',
    images: breakImages,
    trackImages: breakTrackImages,
  },
  page4: {
    playlist: breakPlaylist,
  },
} as const
