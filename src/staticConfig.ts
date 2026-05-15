import type { Playlist } from '@/components/media/VideoPlaylist'

const breakImages: string[] = ['info_001.jpg', 'info_002.jpg']
const breakDkImages: string[] = [
  // 'info_001.jpg',
  // 'info_002.jpg',
  // 'info_003.jpg',
  // 'info_004.jpg',
  // 'info_005.jpg',
  // 'info_006.jpg',
  'info_007.jpg',
  // 'info_008.jpg',
  // 'info_009.jpg',
  // 'info_010.jpg',
  // 'info_011.jpg',
  // 'info_012.jpg',
  // 'info_013.jpg',
  'info_014.jpg',
  'info_015.jpg',
  // 'info_016.jpg',
  'info_017.jpg',
  'info_018.jpg',
  'info_019.jpg',
  'info_020.jpg',
  'info_021.jpg',
  'info_022.jpg',
  // 'info_023.jpg',
  // 'info_024.jpg',
  // 'info_025.jpg',
]

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
  {
    sources: [
      {
        src: 'https://im-file.emtec.tv/cnk2026/freeevol-3dB.mp4',
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
  break: {
    base: {
      loadingIconSrc: '/janog57/logo.png',
      backgroundSrc: '/janog57/background.png',
      audioSrc: '/cnk2026/bgm.mp3',
      hashTag: {
        all: 'janog57',
        break: 'janog57_',
      },
      defaultAvatarSrc:
        'https://www.janog.gr.jp/meeting/janog57/wp-content/uploads/2025/08/cropped-janog_logo_favicon_sq.png',
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
