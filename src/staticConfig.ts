import type { Playlist } from '@/components/media/VideoPlaylist'

const breakImages: string[] = ['info_001.jpg', 'info_002.jpg']
const breakDkImages: string[] = []

const breakPlaylist: Playlist = [
  // {
  //   sources: [
  //     {
  //       src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // },
]

const breakDkPlaylist: Playlist = [
  {
    sources: [
      {
        src: 'https://im-file.emtec.tv/cnk2026/grafana_vol-7dB.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://im-file.emtec.tv/cnk2026/m3vol-0dB.mp4',
        type: 'video/mp4',
      },
    ],
  },
  {
    sources: [
      {
        src: 'https://im-file.emtec.tv/cnk2026/prairie_vol-11dB.mp4',
        type: 'video/mp4',
      },
    ],
  },
  // {
  //   sources: [
  //     {
  //       src: 'https://web-intermission.s3.isk01.sakurastorage.jp/cndw2024/cm5.mp4',
  //       type: 'video/mp4',
  //     },
  //   ],
  // },
]

export const staticConfig = {
  common: {},
  break: {
    base: {
      loadingIconSrc: '/janog57/logo.png',
      backgroundSrc: '/janog57/background.png',
      audioSrc: '/cnk2026/bgm.mp3',
      hashTag: {
        all: 'janog57',
        break: 'janog57_',
      },
    },
    page3: {
      alias: 'janog57',
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
    },
    page3: {
      alias: 'cnk2026',
      images: breakDkImages,
    },
    page4: {
      playlist: breakDkPlaylist,
    },
  },
} as const
