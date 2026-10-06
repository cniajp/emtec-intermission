import { toPlaylist, type Playlist } from '../components/media/playlist'
import type { TrackImageInserts } from './shared'

// TODO: 告知画像が届いたら public/honoconf2026/info/ に置いて列挙する
// (空の間は Page3 をスキップして次のページへ進む)
const breakImages: string[] = []

// trackId ごとに、共通カルーセル(images)の「N枚目(1始まり)」に差し込む画像
// 例: { 1: [{ position: 1, src: 'track_a_intro.jpg' }] }
const breakTrackImages: TrackImageInserts = {
  // 1: [{ position: 2, src: 'info_002.jpg' }],
  // 2: [{ position: 2, src: 'info_003.jpg' }],
}

// TODO: CM 動画が届いたら追加する
const breakPlaylist: Playlist = toPlaylist([])

export const breakConfig = {
  base: {
    eventAbbr: 'honoconf2026',
    loadingIconSrc: '/honoconf2026/logo.png',
    loadingEnabled: true,
    loadingLogoShape: 'circle',
    // 公式サイト https://honoconf.dev/2026 の背景
    backgroundSrc: '/honoconf2026/background.png',
    // TODO: BGM を public/honoconf2026/bgm/ に置いて列挙する
    audioSrcs: [],
    audioShuffle: true,
    audioFadeSeconds: 0,
    audioFadeOutBeforeCm: true,
    hashTag: {
      all: 'honoconf',
      break: '',
    },
    useHashTagAsTrackName: false,
    defaultAvatarSrc: '/honoconf2026/logo.png',
    // NOTE: ヘッダは高さ140px・width:450px/height:auto で描画されるので
    // 横長のタイトル画像を指定すること
    // 公式サイトのロゴタイプ (白文字なので暗い背景色と組み合わせる)
    headerLogoSrc: '/honoconf2026/title.png',
    headerLogoShadow: false,
    headerBackgroundColor: '#000000',
  },
  page1: {
    seconds: 32.5,
    // 公式サイトのアクセントカラー
    cardBackgroundColor: '#ff0006',
    cardTextColor: '#ffffff',
  },
  page2: {
    seconds: 32.5,
    // ユーザートラック=赤 / ディープトラック=ロゴの淡い赤
    trackColors: ['#ff0006', '#f77d83'],
  },
  page3: {
    alias: 'honoconf2026/info',
    images: breakImages,
    trackImages: breakTrackImages,
    secondsPerImage: 10,
  },
  page4: {
    playlist: breakPlaylist,
  },
} as const
