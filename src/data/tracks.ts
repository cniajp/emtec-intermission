import { Track } from './types'

// 公式の名称は「ユーザートラック」「ディープトラック」。ヘッダのトラック欄
// (幅 約213px・text-4xl) では日本語名が折り返すため英語の短縮名にしている
export const tracks: Track[] = [
  {
    id: 1,
    name: 'UserTrack',
    hashTag: 'honoconf_user',
  },
  {
    id: 2,
    name: 'DeepTrack',
    hashTag: 'honoconf_deep',
  },
]
