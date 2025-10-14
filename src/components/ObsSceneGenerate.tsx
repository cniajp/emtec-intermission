type Props = {
  eventAbbr: string | string[]
  confDay: string | string[]
  trackName: string | string[]
  template: template[]
}

type template = {
  name: string
  url_path: string
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
 * ブラウザソース定義を作成
 */
function createBrowserSource(
  name: string,
  url: string,
  sourceUuid: string,
  shutdown: boolean = true,
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
      restart_when_active: true,
      reroute_audio: true,
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
 * 区切り線シーンをJSONファイルから読み込み
 */
async function loadSeparatorScenes(): Promise<object[]> {
  try {
    const response = await fetch('/obs-separator-scenes.json')
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
    const response = await fetch('/obs-fixed-sources.json')
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
    const sceneOrder = [
      { name: 'FUTA' },
      { name: '------' },
      { name: 'CountDown' },
      { name: '-------' },
    ]

    // ソースリストを構築
    const sources: object[] = []

    // 固定シーン（区切り線）をJSONから読み込んで追加
    const separatorScenes = await loadSeparatorScenes()
    sources.push(...separatorScenes)

    // テンプレートからシーンとブラウザソースを生成
    template.forEach((tmpl) => {
      const sceneName = tmpl.name + ' ~'
      const browserName = `Browser_${tmpl.name}`
      const browserUuid = generateUUID()
      const sceneUuid = generateUUID()

      // シーン順序に追加
      sceneOrder.push({ name: sceneName })

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
        protocol + '//' + host + tmpl.url_path,
        browserUuid
      )
      sources.push(browserSource)
    })

    // 固定ソースをJSONから読み込んで追加
    const fixedSources = await loadFixedSources()
    sources.push(...fixedSources)

    // 完全なOBS設定を構築
    const obsConfig = {
      current_scene: 'CountDown',
      current_program_scene: 'CountDown',
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
