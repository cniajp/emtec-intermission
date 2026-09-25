import { OBS_SCENE, attackSceneName, talkSceneName } from './obsSceneNames'

type Props = {
  eventAbbr: string | string[]
  confDay: string | string[]
  trackName: string | string[]
  template: template[]
  includeAttack?: boolean
  includeBackground?: boolean
  includeCountdown?: boolean
  includeSimul?: boolean
  // サイマルの取り込み方。vlc: HLS などを VLC ソースで再生 / browser: Web プレイヤーをブラウザソースで表示
  simulType?: SimulType
  simulUrl?: string
  os?: 'windows' | 'mac'
  username?: string
  // 各ソースの音量 (dB)。OBS の音声ミキサーと同じ単位で指定する
  talkVolumeDb?: number
  countdownVolumeDb?: number
  simulVolumeDb?: number
}

const IMAGE_FUTA_UUID = 'dcad48eb-ec3f-42fa-a976-5d99b417a9da'
const DEFAULT_SIMUL_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

export type SimulType = 'vlc' | 'browser'

type template = {
  name: string
  url_path?: string
  full_url?: string
}

/**
 * dB を OBS の JSON に保存される線形の volume (倍率) に変換
 */
function dbToVolume(db: number): number {
  return Math.pow(10, db / 20)
}

/**
 * クエリパラメータの dB 値をパース。未指定・不正値は 0dB (等倍)
 */
export function parseVolumeDb(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return Number.isFinite(n) ? n : 0
}

/**
 * 配列または文字列を正規化
 */
function normalizeValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value
}

/**
 * UUIDを生成
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * URLを生成
 * @param protocol プロトコル
 * @param host ホスト
 * @param sceneObj シーンオブジェクト
 * @returns 生成されたURL
 */
function generateSceneUrl(
  protocol: string,
  host: string,
  sceneObj: template
): string {
  return sceneObj.full_url
    ? sceneObj.full_url
    : protocol + '//' + host + sceneObj.url_path
}

/**
 * ブラウザソース定義を作成
 */
function createBrowserSource(
  name: string,
  url: string,
  sourceUuid: string,
  shutdown: boolean = true,
  restart: boolean = true,
  volume: number = 1.0
) {
  return {
    prev_ver: 536870913,
    name: name,
    uuid: sourceUuid,
    id: 'browser_source',
    versioned_id: 'browser_source',
    settings: {
      url: url,
      width: 1920,
      height: 1080,
      shutdown: shutdown,
      restart_when_active: restart,
      reroute_audio: true,
      css: 'body { background-color: rgba(255, 255, 255, 1); margin: 0px auto; overflow: hidden; }',
    },
    mixers: 255,
    sync: 0,
    flags: 0,
    volume: volume,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'libobs.mute': [],
      'libobs.unmute': [],
      'libobs.push-to-mute': [],
      'libobs.push-to-talk': [],
      'ObsBrowser.Refresh': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 2,
    private_settings: {},
  }
}

/**
 * ブラウザソース付きシーンを作成
 */
function createSceneWithBrowser(
  sceneName: string,
  browserSourceName: string,
  browserSourceUuid: string,
  sceneUuid: string
) {
  return {
    prev_ver: 536870913,
    name: sceneName,
    uuid: sceneUuid,
    id: 'scene',
    versioned_id: 'scene',
    settings: {
      id_counter: 1,
      custom_size: false,
      items: [
        {
          name: browserSourceName,
          source_uuid: browserSourceUuid,
          visible: true,
          locked: false,
          rot: 0.0,
          scale_ref: {
            x: 1920.0,
            y: 1080.0,
          },
          align: 5,
          bounds_type: 0,
          bounds_align: 0,
          bounds_crop: false,
          crop_left: 0,
          crop_top: 0,
          crop_right: 0,
          crop_bottom: 0,
          id: 1,
          group_item_backup: false,
          pos: {
            x: 0.0,
            y: 0.0,
          },
          pos_rel: {
            x: -1.7777777910232544,
            y: -1.0,
          },
          scale: {
            x: 1.0,
            y: 1.0,
          },
          scale_rel: {
            x: 1.0,
            y: 1.0,
          },
          bounds: {
            x: 0.0,
            y: 0.0,
          },
          bounds_rel: {
            x: 0.0,
            y: 0.0,
          },
          scale_filter: 'disable',
          blend_method: 'default',
          blend_type: 'normal',
          show_transition: {
            duration: 0,
          },
          hide_transition: {
            duration: 0,
          },
          private_settings: {},
        },
      ],
    },
    mixers: 0,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'OBSBasic.SelectScene': [],
      'libobs.show_scene_item.1': [],
      'libobs.hide_scene_item.1': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 0,
    canvas_uuid: '6c69626f-6273-4c00-9d88-c5136d61696e',
    private_settings: {},
  }
}

/**
 * OS別の動画パスを生成
 * パス形式: Desktop/{eventAbbr}/{trackName}/{time}.mp4
 * 時刻のコロンを削除（09:00 → 0900）
 */
function getAttackVideoPath(
  os: 'windows' | 'mac',
  username: string,
  eventAbbr: string,
  trackName: string,
  time: string
): string {
  const safeTime = time.replace(/:/g, '')
  if (os === 'mac') {
    return `/Users/${username}/Desktop/${eventAbbr}/${trackName}/${safeTime}.mp4`
  }
  return `C:/Users/${username}/Desktop/${eventAbbr}/${trackName}/${safeTime}.mp4`
}

/**
 * OS別の背景画像パスを生成
 * パス形式: Desktop/{eventAbbr}/still/LogoOnly_wBG.png
 */
function getBackgroundImagePath(
  os: 'windows' | 'mac',
  username: string,
  eventAbbr: string
): string {
  if (os === 'mac') {
    return `/Users/${username}/Desktop/${eventAbbr}/still/LogoOnly_wBG.png`
  }
  return `C:/Users/${username}/Desktop/${eventAbbr}/still/LogoOnly_wBG.png`
}

/**
 * OS別のカウントダウン動画パスを生成
 * パス形式: Desktop/{eventAbbr}/countdown.mp4
 */
function getCountdownPath(
  os: 'windows' | 'mac',
  username: string,
  eventAbbr: string
): string {
  if (os === 'mac') {
    return `/Users/${username}/Desktop/${eventAbbr}/countdown.mp4`
  }
  return `C:/Users/${username}/Desktop/${eventAbbr}/countdown.mp4`
}

/**
 * 背景用 Image_FUTA アイテム定義を作成
 * obs-fixed-sources.json の FUTAシーン内アイテム定義に準拠
 */
function createImageFutaItem(id: number) {
  return {
    name: 'Image_FUTA',
    source_uuid: IMAGE_FUTA_UUID,
    visible: true,
    locked: false,
    rot: 0.0,
    scale_ref: { x: 1920.0, y: 1080.0 },
    align: 5,
    bounds_type: 0,
    bounds_align: 0,
    bounds_crop: false,
    crop_left: 0,
    crop_top: 0,
    crop_right: 0,
    crop_bottom: 0,
    id,
    group_item_backup: false,
    pos: { x: 0.0, y: 0.0 },
    pos_rel: { x: -1.7777777910232544, y: -1.0 },
    scale: { x: 1.0, y: 1.0 },
    scale_rel: { x: 1.0, y: 1.0 },
    bounds: { x: 0.0, y: 0.0 },
    bounds_rel: { x: 0.0, y: 0.0 },
    scale_filter: 'disable',
    blend_method: 'default',
    blend_type: 'normal',
    show_transition: { duration: 0 },
    hide_transition: { duration: 0 },
    private_settings: {},
  }
}

/**
 * シーン1つに対して Image_FUTA を最背面（items[] 先頭）に挿入
 * OBSのシーンJSONでは items[] の先頭が最背面レイヤーになるため、
 * 他の素材（ブラウザソース・動画など）より下に表示される
 * 既に存在する場合はスキップ（FUTAシーンの重複防止）
 */
function injectImageFutaBackground(scene: {
  settings?: { items?: unknown[]; id_counter?: number }
}) {
  const items = scene?.settings?.items as { source_uuid?: string }[] | undefined
  if (!Array.isArray(items)) return
  if (items.some((it) => it?.source_uuid === IMAGE_FUTA_UUID)) return
  const nextId = (scene.settings!.id_counter ?? items.length) + 1
  items.unshift(createImageFutaItem(nextId))
  scene.settings!.id_counter = nextId
}

/**
 * アタック動画ソース（ffmpeg_source）を作成
 */
function createAttackVideoSource(
  name: string,
  sourceUuid: string,
  os: 'windows' | 'mac',
  username: string,
  eventAbbr: string,
  trackName: string,
  time: string
) {
  return {
    prev_ver: 536870913,
    name: name,
    uuid: sourceUuid,
    id: 'ffmpeg_source',
    versioned_id: 'ffmpeg_source',
    settings: {
      local_file: getAttackVideoPath(os, username, eventAbbr, trackName, time),
      close_when_inactive: true,
      looping: false,
    },
    mixers: 255,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'libobs.mute': [],
      'libobs.unmute': [],
      'libobs.push-to-mute': [],
      'libobs.push-to-talk': [],
      'MediaSource.Restart': [],
      'MediaSource.Play': [],
      'MediaSource.Pause': [],
      'MediaSource.Stop': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 2,
    private_settings: {},
  }
}

/**
 * アタック動画付きシーンを作成
 */
function createSceneWithAttackVideo(
  sceneName: string,
  videoSourceName: string,
  videoSourceUuid: string,
  sceneUuid: string
) {
  return {
    prev_ver: 536870913,
    name: sceneName,
    uuid: sceneUuid,
    id: 'scene',
    versioned_id: 'scene',
    settings: {
      id_counter: 1,
      custom_size: false,
      items: [
        {
          name: videoSourceName,
          source_uuid: videoSourceUuid,
          visible: true,
          locked: false,
          rot: 0.0,
          scale_ref: {
            x: 1920.0,
            y: 1080.0,
          },
          align: 5,
          bounds_type: 0,
          bounds_align: 0,
          bounds_crop: false,
          crop_left: 0,
          crop_top: 0,
          crop_right: 0,
          crop_bottom: 0,
          id: 1,
          group_item_backup: false,
          pos: {
            x: 0.0,
            y: 0.0,
          },
          pos_rel: {
            x: -1.7777777910232544,
            y: -1.0,
          },
          scale: {
            x: 1.0,
            y: 1.0,
          },
          scale_rel: {
            x: 1.0,
            y: 1.0,
          },
          bounds: {
            x: 0.0,
            y: 0.0,
          },
          bounds_rel: {
            x: 0.0,
            y: 0.0,
          },
          scale_filter: 'disable',
          blend_method: 'default',
          blend_type: 'normal',
          show_transition: {
            duration: 0,
          },
          hide_transition: {
            duration: 0,
          },
          private_settings: {},
        },
      ],
    },
    mixers: 0,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'OBSBasic.SelectScene': [],
      'libobs.show_scene_item.1': [],
      'libobs.hide_scene_item.1': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 0,
    canvas_uuid: '6c69626f-6273-4c00-9d88-c5136d61696e',
    private_settings: {},
  }
}

/**
 * VLCソース（vlc_source）を作成
 */
function createVlcSource(
  name: string,
  sourceUuid: string,
  playlistUrl: string,
  volume: number = 1.0
) {
  return {
    prev_ver: 536870913,
    name,
    uuid: sourceUuid,
    id: 'vlc_source',
    versioned_id: 'vlc_source',
    settings: {
      playlist: [
        {
          value: playlistUrl,
          uuid: generateUUID(),
          selected: false,
          hidden: false,
        },
      ],
    },
    mixers: 255,
    sync: 0,
    flags: 0,
    volume,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'libobs.mute': [],
      'libobs.unmute': [],
      'libobs.push-to-mute': [],
      'libobs.push-to-talk': [],
      'VLCSource.PlayPause': [],
      'VLCSource.Restart': [],
      'VLCSource.Stop': [],
      'VLCSource.PlaylistNext': [],
      'VLCSource.PlaylistPrev': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 2,
    private_settings: {},
  }
}

/**
 * サイマルシーンを作成（VLC またはブラウザのソースを1つ含む）
 */
function createSimulScene(
  sceneUuid: string,
  sourceName: string,
  sourceUuid: string
) {
  return {
    prev_ver: 536870913,
    name: OBS_SCENE.simul,
    uuid: sceneUuid,
    id: 'scene',
    versioned_id: 'scene',
    settings: {
      id_counter: 1,
      custom_size: false,
      items: [
        {
          name: sourceName,
          source_uuid: sourceUuid,
          visible: true,
          locked: false,
          rot: 0.0,
          scale_ref: { x: 1920.0, y: 1080.0 },
          align: 5,
          bounds_type: 0,
          bounds_align: 0,
          bounds_crop: false,
          crop_left: 0,
          crop_top: 0,
          crop_right: 0,
          crop_bottom: 0,
          id: 1,
          group_item_backup: false,
          pos: { x: 0.0, y: 0.0 },
          pos_rel: { x: -1.7777777910232544, y: -1.0 },
          scale: { x: 1.0, y: 1.0 },
          scale_rel: { x: 1.0, y: 1.0 },
          bounds: { x: 0.0, y: 0.0 },
          bounds_rel: { x: 0.0, y: 0.0 },
          scale_filter: 'disable',
          blend_method: 'default',
          blend_type: 'normal',
          show_transition: { duration: 300 },
          hide_transition: { duration: 300 },
          private_settings: {},
        },
      ],
    },
    mixers: 0,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'OBSBasic.SelectScene': [],
      'libobs.show_scene_item.1': [],
      'libobs.hide_scene_item.1': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 0,
    canvas_uuid: '6c69626f-6273-4c00-9d88-c5136d61696e',
    private_settings: {},
  }
}

/**
 * 区切り線シーンをJSONファイルから読み込み
 */
async function loadSeparatorScenes(): Promise<object[]> {
  try {
    const response = await fetch('/obs-scenes/obs-separator-scenes.json')
    if (!response.ok) {
      throw new Error(`Failed to load separator scenes: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading separator scenes:', error)
    // フォールバック: 空の配列を返す
    return []
  }
}

/**
 * 区切り線シーンを動的に生成
 */
function createSeparatorScene(name: string) {
  return {
    prev_ver: 536870913,
    name: name,
    uuid: generateUUID(),
    id: 'scene',
    versioned_id: 'scene',
    settings: {
      id_counter: 0,
      custom_size: false,
      items: [],
    },
    mixers: 0,
    sync: 0,
    flags: 0,
    volume: 1.0,
    balance: 0.5,
    enabled: true,
    muted: false,
    'push-to-mute': false,
    'push-to-mute-delay': 0,
    'push-to-talk': false,
    'push-to-talk-delay': 0,
    hotkeys: {
      'OBSBasic.SelectScene': [],
    },
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
    monitoring_type: 0,
    canvas_uuid: '6c69626f-6273-4c00-9d88-c5136d61696e',
    private_settings: {},
  }
}

/**
 * OBSクイックトランジション設定を作成
 */
function createQuickTransitions() {
  return [
    {
      name: 'カット',
      duration: 300,
      hotkeys: [],
      id: 22,
      fade_to_black: false,
    },
    {
      name: 'フェード',
      duration: 300,
      hotkeys: [],
      id: 23,
      fade_to_black: false,
    },
    {
      name: 'フェード',
      duration: 300,
      hotkeys: [],
      id: 24,
      fade_to_black: true,
    },
  ]
}

/**
 * 固定ソース（CountDown, FUTAなど）をJSONファイルから読み込み
 */
async function loadFixedSources(): Promise<object[]> {
  try {
    const response = await fetch('/obs-scenes/obs-fixed-sources.json')
    if (!response.ok) {
      throw new Error(`Failed to load fixed sources: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading fixed sources:', error)
    // フォールバック: 空の配列を返す
    return []
  }
}

/**
 * OBSシーン設定を生成してダウンロード
 */
export default function ObsSceneGenerate({
  eventAbbr,
  confDay,
  trackName: _trackName,
  template,
  includeAttack = false,
  includeBackground = false,
  includeCountdown = false,
  includeSimul = false,
  simulType = 'vlc',
  simulUrl = DEFAULT_SIMUL_URL,
  os = 'windows',
  username = 'emtec',
  talkVolumeDb = 0,
  countdownVolumeDb = 0,
  simulVolumeDb = 0,
}: Props) {
  const host = window.location.host
  const protocol = window.location.protocol

  // 値を正規化
  const abbr = normalizeValue(eventAbbr)
  const day = normalizeValue(confDay)
  const tName = normalizeValue(_trackName)

  // イベント名を構築
  const eventName = `${abbr}_Day${day}_Track${tName}`

  // 非同期でOBS設定を生成
  const generateObsConfig = async () => {
    // シーン順序を構築
    const sceneOrder: { name: string }[] = [
      { name: OBS_SCENE.futa },
      { name: OBS_SCENE.separator },
    ]
    if (includeCountdown) {
      sceneOrder.push({ name: OBS_SCENE.countdown })
    }
    sceneOrder.push({ name: '-------' })

    // サイマルを CountDown と '-------' の間に挿入
    if (includeSimul) {
      const insertIndex = sceneOrder.findIndex((s) => s.name === '-------')
      sceneOrder.splice(insertIndex, 0, { name: OBS_SCENE.simul })
    }

    console.log('eventName:', eventName)
    console.log('roomName:', tName)

    // 特定の条件でSlidoシーンを追加
    if (eventName === 'o11yconjp_Day1_TrackA') {
      const fullUrl =
        'https://auth.slido.com/eu1/api/latest/the-auth/user/lifecycle-process/shareable-link/init?token=f05927ef1a9ec541524b9612cf6eccf9d034ff89e19a8e5376d3468c5c5bf83a'
      sceneOrder.push({ name: 'Slido' })
      template.unshift({ name: 'Slido', full_url: fullUrl })
    }

    console.log('template:', template)

    // ソースリストを構築
    const sources: object[] = []

    // 固定シーン（区切り線）をJSONから読み込んで追加
    const separatorScenes = await loadSeparatorScenes()
    sources.push(...separatorScenes)

    // サイマルシーンとソース (VLC / ブラウザ) を追加。
    // シーン名は種別によらず OBS_SCENE.simul (Companion の TrackA ボタンが参照する)
    if (includeSimul) {
      const simulSourceUuid = generateUUID()
      const simulSceneUuid = generateUUID()
      const simulVolume = dbToVolume(simulVolumeDb)
      const simulSourceName =
        simulType === 'browser' ? 'Browser_サイマル' : 'VLC_サイマル'
      sources.push(
        createSimulScene(simulSceneUuid, simulSourceName, simulSourceUuid)
      )
      sources.push(
        simulType === 'browser'
          ? // 裏で再生し続けて切り替えた瞬間に映るよう、非表示でも止めない
            createBrowserSource(
              simulSourceName,
              simulUrl,
              simulSourceUuid,
              false,
              false,
              simulVolume
            )
          : createVlcSource(
              simulSourceName,
              simulSourceUuid,
              simulUrl,
              simulVolume
            )
      )
    }

    // アタック動画用の一時リスト
    const attackSceneOrders: { name: string }[] = []

    // テンプレートからシーンとブラウザソースを生成
    template.forEach((tmpl) => {
      const isDefault = tmpl.name !== 'Slido'
      const sceneName = isDefault ? talkSceneName(tmpl.name) : tmpl.name
      const browserName = `Browser_${tmpl.name}`
      const browserUuid = generateUUID()
      const sceneUuid = generateUUID()

      // シーン順序に追加（トーク枠）
      if (isDefault) {
        sceneOrder.push({ name: sceneName })
      }

      // シーンを作成
      const scene = createSceneWithBrowser(
        sceneName,
        browserName,
        browserUuid,
        sceneUuid
      )
      sources.push(scene)

      // ブラウザソースを作成
      const browserSource = createBrowserSource(
        browserName,
        generateSceneUrl(protocol, host, tmpl),
        browserUuid,
        isDefault ? true : false,
        isDefault ? true : false,
        // Slido は音声を持たないので等倍のまま
        isDefault ? dbToVolume(talkVolumeDb) : 1.0
      )
      sources.push(browserSource)

      // アタック動画シーンを作成（includeAttack=trueかつ通常のトーク枠の場合）
      if (includeAttack && isDefault) {
        const attackSceneTitle = attackSceneName(tmpl.name)
        const attackVideoName = `Movie_Attack_${tmpl.name}`
        const attackVideoUuid = generateUUID()
        const attackSceneUuid = generateUUID()

        // アタック動画シーン順序を一時リストに追加
        attackSceneOrders.push({ name: attackSceneTitle })

        // アタック動画シーンを作成
        const attackScene = createSceneWithAttackVideo(
          attackSceneTitle,
          attackVideoName,
          attackVideoUuid,
          attackSceneUuid
        )
        sources.push(attackScene)

        // アタック動画ソースを作成
        const attackVideoSource = createAttackVideoSource(
          attackVideoName,
          attackVideoUuid,
          os,
          username,
          abbr,
          tName,
          tmpl.name
        )
        sources.push(attackVideoSource)
      }
    })

    // アタック動画がある場合、区切り線を追加してからアタック動画シーンを追加
    if (includeAttack && attackSceneOrders.length > 0) {
      const attackSeparatorName = '--------'
      sceneOrder.push({ name: attackSeparatorName })
      sceneOrder.push(...attackSceneOrders)
      // 区切り線シーンをsourcesに追加
      sources.push(createSeparatorScene(attackSeparatorName))
    }

    // 固定ソースをJSONから読み込んで追加
    const fixedSources = await loadFixedSources()
    const filteredFixed = includeCountdown
      ? fixedSources
      : fixedSources.filter(
          (s) =>
            (s as { name?: string }).name !== OBS_SCENE.countdown &&
            (s as { name?: string }).name !== 'Movie_CountDown'
        )
    sources.push(...filteredFixed)

    // カウントダウンが有効なら Movie_CountDown の local_file をセット
    if (includeCountdown) {
      const countdownPath = getCountdownPath(os, username, abbr)
      const movieCountdown = sources.find(
        (s) =>
          (s as { name?: string; id?: string }).name === 'Movie_CountDown' &&
          (s as { name?: string; id?: string }).id === 'ffmpeg_source'
      ) as { settings?: Record<string, unknown>; volume?: number } | undefined
      if (movieCountdown) {
        movieCountdown.settings = {
          ...movieCountdown.settings,
          local_file: countdownPath,
        }
        movieCountdown.volume = dbToVolume(countdownVolumeDb)
      }
    }

    // 背景画像オプション処理
    if (includeBackground) {
      const bgPath = getBackgroundImagePath(os, username, abbr)
      // すべてのシーンに Image_FUTA を背面挿入（既に持つシーンはスキップ）
      for (const src of sources) {
        if ((src as { id?: string }).id === 'scene') {
          injectImageFutaBackground(
            src as { settings?: { items?: unknown[]; id_counter?: number } }
          )
        }
      }
      // Image_FUTA ソース本体のファイルパスをセット
      const futaSource = sources.find(
        (s) =>
          (s as { uuid?: string; id?: string }).uuid === IMAGE_FUTA_UUID &&
          (s as { uuid?: string; id?: string }).id === 'image_source'
      ) as { settings?: Record<string, unknown> } | undefined
      if (futaSource) {
        futaSource.settings = { ...futaSource.settings, file: bgPath }
      }
    }

    console.log('sceneOrder:', sceneOrder)

    // 完全なOBS設定を構築
    const obsConfig = {
      current_scene: includeCountdown ? OBS_SCENE.countdown : OBS_SCENE.futa,
      current_program_scene: includeCountdown
        ? OBS_SCENE.countdown
        : OBS_SCENE.futa,
      scene_order: sceneOrder,
      name: eventName,
      groups: [],
      quick_transitions: createQuickTransitions(),
      transitions: [],
      saved_projectors: [],
      canvases: [],
      current_transition: 'カット',
      transition_duration: 300,
      preview_locked: false,
      scaling_enabled: false,
      scaling_level: 0,
      scaling_off_x: 0.0,
      scaling_off_y: 0.0,
      'virtual-camera': {
        type2: 3,
      },
      modules: {
        decklink_captions: {
          source: '',
        },
        'scripts-tool': [],
        'output-timer': {
          streamTimerHours: 0,
          streamTimerMinutes: 0,
          streamTimerSeconds: 30,
          recordTimerHours: 0,
          recordTimerMinutes: 0,
          recordTimerSeconds: 30,
          autoStartStreamTimer: false,
          autoStartRecordTimer: false,
          pauseRecordTimer: true,
        },
      },
      resolution: {
        x: 1920,
        y: 1080,
      },
      version: 2,
      sources: sources,
    }

    // JSONをエンコードしてダウンロード
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(obsConfig, null, 2)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `obs_scene_${abbr}_day${day}_track${tName}.json`

    // ダウンロードをトリガー
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 非同期処理を実行
  generateObsConfig().catch((error) => {
    console.error('Error generating OBS config:', error)
  })
}
