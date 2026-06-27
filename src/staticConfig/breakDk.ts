import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

const breakDkImages: string[] = []

const breakDkTrackImages: TrackImageInserts = {}

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

export const breakDkConfig = {
  base: {
    loadingIconSrc: '/cnk2026/logo.png',
    loadingEnabled: true,
    loadingLogoClassName: '',
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
    trackImages: breakDkTrackImages,
  },
  page4: {
    playlist: breakDkPlaylist,
  },
} as const
