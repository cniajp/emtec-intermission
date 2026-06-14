import { toPlaylist, type Playlist } from './components/media/playlist'

const breakImages: string[] = []
const breakDkImages: string[] = []

const breakPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/cnk2026/grafana_vol-7dB.mp4',
    type: 'video/mp4',
  },
])

const breakDkPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/cnk2026/grafana_vol-7dB.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/cnk2026/m3vol-0dB.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/cnk2026/prairie_vol-11dB.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/cnk2026/freeevol-3dB.mp4',
    type: 'video/mp4',
  },
  // {
  //   src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //   type: 'video/mp4',
  // },
])

export const staticConfig = {
  break: {
    base: {
      loadingIconSrc: '/kinoko2026/logo-bg-white.png',
      backgroundSrc: '/kinoko2026/background.png',
      audioSrc: '/pek2025/pek2025_intermission.mp3',
      hashTag: {
        all: 'きのこ2026',
        break: '',
      },
      useHashTagAsTrackName: true,
      defaultAvatarSrc: '/kinoko2026/logo-bg-white.png',
    },
    page3: {
      alias: 'kinoko2026/info',
      images: breakImages,
    },
    page4: {
      playlist: breakPlaylist,
    },
  },
  breakDk: {
    base: {
      loadingIconSrc: '/cnk2026/logo.png',
      backgroundSrc: '/cnk2026/new/background.jpg',
      audioSrc: '/cnk2026/bgm.mp3',
      hashTag: {
        all: 'cloudnativekaigi',
        break: 'cloudnativekaigi_',
      },
      useHashTagAsTrackName: false,
      defaultAvatarSrc: '/cnk2026/logo.png',
    },
    page3: {
      alias: 'cnk2026/info',
      images: breakDkImages,
    },
    page4: {
      playlist: breakDkPlaylist,
    },
  },
} as const
