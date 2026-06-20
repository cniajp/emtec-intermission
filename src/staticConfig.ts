import { toPlaylist, type Playlist } from './components/media/playlist'

export type TrackImageInsert = { position: number; src: string }
export type TrackImageInserts = Record<number, ReadonlyArray<TrackImageInsert>>

const breakImages: string[] = ['info_001.jpg']
const breakDkImages: string[] = []

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  1: [{ position: 2, src: 'info_002.jpg' }],
  2: [{ position: 2, src: 'info_003.jpg' }],
  3: [{ position: 2, src: 'info_004.jpg' }],
}
const breakDkTrackImages: TrackImageInserts = {}

export function buildPage3Images(
  common: ReadonlyArray<string>,
  inserts: ReadonlyArray<TrackImageInsert> | undefined
): string[] {
  const result = [...common]
  if (!inserts || inserts.length === 0) return result
  const sorted = [...inserts].sort((a, b) => a.position - b.position)
  for (const { position, src } of sorted) {
    const idx = Math.max(0, Math.min(result.length, position - 1))
    result.splice(idx, 0, src)
  }
  return result
}

const breakPlaylist: Playlist = toPlaylist([
  {
    src: 'https://im-file.emtec.tv/kinoko2026/collabostyle.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/hokan.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/mybest.mp4',
    type: 'video/mp4',
  },
  {
    src: 'https://im-file.emtec.tv/kinoko2026/tenshokudraft.mp4',
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
      trackImages: breakTrackImages,
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
      trackImages: breakDkTrackImages,
    },
    page4: {
      playlist: breakDkPlaylist,
    },
  },
} as const
