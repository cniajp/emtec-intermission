type Props = {
  device: 'gostream' | 'vr6hd'
  times: string[]
  specialButtons: {
    count?: boolean
    trackA?: boolean
    slido?: boolean
  }
  includeAttack?: boolean
}

// nanoid互換の21文字ID生成
function generateNanoId(): string {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_*'
  let id = ''
  for (let i = 0; i < 21; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return id
}

// レイアウトボタン定義
const LAYOUT_BUTTONS = [
  { text: 'Slide', macroIndex: 0, dthCode: '00' },
  { text: 'Futae', macroIndex: 1, dthCode: '01' },
  { text: 'Person', macroIndex: 2, dthCode: '02' },
  { text: 'Logo', macroIndex: 3, dthCode: '03' },
  { text: 'End', macroIndex: 4, dthCode: '04' },
]

// 特殊ボタン定義
const SPECIAL_BUTTONS = {
  count: {
    text: 'Count',
    obsScene: 'CountDown',
    macroIndex: 5,
    dthCode: '05',
  },
  trackA: {
    text: 'TrackA',
    obsScene: 'TrackA',
    macroIndex: 5,
    dthCode: '05',
  },
  slido: {
    text: 'Slido',
    obsScene: '------',
    macroIndex: 6,
    dthCode: '06',
  },
}

// スタイル定数
const BUTTON_STYLE_BASE = {
  textExpression: false,
  png64: null,
  alignment: 'center:center',
  pngalignment: 'center:center',
  color: 16777215,
  bgcolor: 0,
  show_topbar: 'default',
  png: null,
}

// ボタンオプション
const BUTTON_OPTIONS = {
  stepProgression: 'auto',
  stepExpression: '',
  rotaryActions: false,
}

// GoStream用アクション作成
function createGoStreamAction(
  connectionId: string,
  macroIndex: number
): object {
  return {
    type: 'action',
    id: generateNanoId(),
    definitionId: 'macroRunStart',
    connectionId,
    options: { MacroIndex: macroIndex },
    upgradeIndex: 5,
  }
}

// VR-6HD用アクション作成（2つのsendコマンドを返す）
function createVR6HDActions(connectionId: string, dthCode: string): object[] {
  return [
    {
      type: 'action',
      id: generateNanoId(),
      definitionId: 'send',
      connectionId,
      options: { id_send: '0000', id_end: '\n' },
    },
    {
      type: 'action',
      id: generateNanoId(),
      definitionId: 'send',
      connectionId,
      options: { id_send: `DTH:500504,${dthCode};`, id_end: '\n' },
    },
  ]
}

// OBS set_sceneアクション作成
function createObsSetSceneAction(connectionId: string, scene: string): object {
  return {
    type: 'action',
    id: generateNanoId(),
    definitionId: 'set_scene',
    connectionId,
    options: { scene, customSceneName: '' },
  }
}

// ボタン定義作成
function createButton(
  text: string,
  size: string,
  actions: object[]
): object {
  return {
    type: 'button',
    style: {
      ...BUTTON_STYLE_BASE,
      text,
      size,
    },
    options: BUTTON_OPTIONS,
    feedbacks: [],
    steps: {
      '0': {
        action_sets: {
          down: actions,
          up: [],
        },
        options: {
          runWhileHeld: [],
        },
      },
    },
    localVariables: [],
  }
}

// pageup/pagedownボタン作成
function createPageNavigationButton(
  direction: 'pageup' | 'pagedown'
): object {
  return {
    type: direction,
  }
}

// インスタンス（接続設定）を生成
function createInstances(device: 'gostream' | 'vr6hd'): {
  instances: Record<string, object>
  deviceConnectionId: string
  obsConnectionId: string
} {
  const deviceConnectionId = generateNanoId()
  const obsConnectionId = generateNanoId()

  const instances: Record<string, object> = {}

  if (device === 'gostream') {
    instances[deviceConnectionId] = {
      instance_type: 'osee-gostream-series',
      moduleVersionId: '1.0.0',
      updatePolicy: 'stable',
      sortOrder: 1,
      label: 'gostream-series',
      isFirstInit: false,
      config: {
        modelId: 16,
        host: '192.168.179.129',
      },
      secrets: {},
      lastUpgradeIndex: 5,
      enabled: true,
    }
  } else {
    instances[deviceConnectionId] = {
      instance_type: 'generic-tcp-udp',
      moduleVersionId: '2.2.0',
      updatePolicy: 'stable',
      sortOrder: 1,
      label: 'VR-6HD',
      isFirstInit: false,
      config: {
        port: '8023',
        prot: 'tcp',
        host: '192.168.179.129',
      },
      secrets: {},
      lastUpgradeIndex: 0,
      enabled: true,
    }
  }

  instances[obsConnectionId] = {
    instance_type: 'obs-studio',
    moduleVersionId: '3.13.1',
    updatePolicy: 'stable',
    sortOrder: 2,
    label: 'obs',
    isFirstInit: false,
    config: {
      port: 4455,
      host: 'localhost',
      pass: '',
    },
    secrets: {},
    lastUpgradeIndex: 7,
    enabled: true,
  }

  return { instances, deviceConnectionId, obsConnectionId }
}

// サーフェス設定
function createSurfaces(firstPageId: string): Record<string, object> {
  const surfaceConfig = {
    groupConfig: {
      name: 'Auto group',
      last_page_id: firstPageId,
      startup_page_id: firstPageId,
      use_last_page: true,
      page: 1,
      last_page: 1,
      startup_page: 1,
    },
    config: {
      brightness: 100,
      rotation: 0,
      never_lock: false,
      xOffset: 0,
      yOffset: 0,
      groupId: null,
    },
  }

  return {
    'streamdeck:default': {
      ...surfaceConfig,
      type: 'Elgato Stream Deck',
      integrationType: 'elgato-streamdeck',
      gridSize: {
        columns: 5,
        rows: 3,
      },
    },
  }
}

export default function CompanionConfigGenerate({
  device,
  times,
  specialButtons,
  includeAttack = false,
}: Props) {
  const generateConfig = () => {
    // 接続設定を生成
    const { instances, deviceConnectionId, obsConnectionId } =
      createInstances(device)

    // 時刻ボタンと特殊ボタンを結合
    type ButtonItem = {
      type: 'time' | 'special'
      text: string
      obsScene: string
      macroIndex: number
      dthCode: string
    }

    const buttonItems: ButtonItem[] = []

    // 時刻ボタンを追加
    times.forEach((time) => {
      buttonItems.push({
        type: 'time',
        text: time,
        obsScene: `${time} ~`,
        macroIndex: 5,
        dthCode: '05',
      })
    })

    // アタック動画ボタンを追加
    if (includeAttack) {
      times.forEach((time) => {
        buttonItems.push({
          type: 'time',
          text: `A_${time}`,
          obsScene: `Attack_${time}`,
          macroIndex: 5,
          dthCode: '05',
        })
      })
    }

    // 特殊ボタンを追加
    if (specialButtons.count) {
      buttonItems.push({
        type: 'special',
        ...SPECIAL_BUTTONS.count,
      })
    }
    if (specialButtons.trackA) {
      buttonItems.push({
        type: 'special',
        ...SPECIAL_BUTTONS.trackA,
      })
    }
    if (specialButtons.slido) {
      buttonItems.push({
        type: 'special',
        ...SPECIAL_BUTTONS.slido,
      })
    }

    // ページ計算
    // row 0: レイアウトボタン (5個)
    // 複数ページの場合: col 4 をナビゲーションに使用
    //   row 1: 4個 (col 0-3) + pageup (col 4)
    //   row 2: 4個 (col 0-3) + pagedown (col 4)
    //   1ページあたり最大8個
    // 単一ページの場合:
    //   row 1: 5個, row 2: 5個 = 最大10個

    const totalButtons = buttonItems.length
    // まず複数ページが必要かを判定（8個超なら複数ページ）
    const needsMultiplePages = totalButtons > 8
    const BUTTONS_PER_PAGE = needsMultiplePages ? 8 : 10
    const totalPages = Math.max(1, Math.ceil(totalButtons / BUTTONS_PER_PAGE))

    const pages: Record<string, object> = {}
    let buttonIndex = 0

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageId = generateNanoId()
      const isFirstPage = pageNum === 1
      const isLastPage = pageNum === totalPages
      const hasMultiplePages = totalPages > 1

      // ページごとのコントロール
      const controls: Record<string, Record<string, object>> = {}

      // Row 0: レイアウトボタン（固定）
      controls['0'] = {}
      LAYOUT_BUTTONS.forEach((btn, col) => {
        const actions: object[] = []

        // デバイス用アクション
        if (device === 'gostream') {
          actions.push(createGoStreamAction(deviceConnectionId, btn.macroIndex))
        } else {
          actions.push(...createVR6HDActions(deviceConnectionId, btn.dthCode))
        }

        // OBS用アクション
        actions.push(createObsSetSceneAction(obsConnectionId, '------'))

        controls['0'][col.toString()] = createButton(btn.text, '18', actions)
      })

      // Row 1-2: 時刻/特殊ボタン
      const buttonsThisPage = Math.min(
        BUTTONS_PER_PAGE,
        totalButtons - buttonIndex
      )

      // 複数ページの場合は col 4 をナビゲーションに使用
      const maxColsPerRow = hasMultiplePages ? 4 : 5

      // row 1のボタン配置
      controls['1'] = {}
      for (let i = 0; i < Math.min(maxColsPerRow, buttonsThisPage); i++) {
        if (buttonIndex + i < totalButtons) {
          const item = buttonItems[buttonIndex + i]
          const actions: object[] = []

          if (device === 'gostream') {
            actions.push(
              createGoStreamAction(deviceConnectionId, item.macroIndex)
            )
          } else {
            actions.push(...createVR6HDActions(deviceConnectionId, item.dthCode))
          }
          actions.push(createObsSetSceneAction(obsConnectionId, item.obsScene))

          controls['1'][i.toString()] = createButton(item.text, '24', actions)
        }
      }

      // row 2のボタン配置
      controls['2'] = {}
      const row2Start = maxColsPerRow

      for (let i = 0; i < maxColsPerRow; i++) {
        const itemIdx = buttonIndex + row2Start + i
        if (itemIdx < totalButtons && i + row2Start < buttonsThisPage) {
          const item = buttonItems[itemIdx]
          const actions: object[] = []

          if (device === 'gostream') {
            actions.push(
              createGoStreamAction(deviceConnectionId, item.macroIndex)
            )
          } else {
            actions.push(...createVR6HDActions(deviceConnectionId, item.dthCode))
          }
          actions.push(createObsSetSceneAction(obsConnectionId, item.obsScene))

          controls['2'][i.toString()] = createButton(item.text, '24', actions)
        }
      }

      // ページナビゲーションボタン (col 4 に縦配置)
      if (hasMultiplePages) {
        // row 1 col 4: pageup（戻る）- 1ページ目以外で表示
        if (!isFirstPage) {
          controls['1']['4'] = createPageNavigationButton('pageup')
        }
        // row 2 col 4: pagedown（次へ）- 最終ページ以外で表示
        if (!isLastPage) {
          controls['2']['4'] = createPageNavigationButton('pagedown')
        }
      }

      pages[pageNum.toString()] = {
        id: pageId,
        name: `Page${pageNum}`,
        controls,
        gridSize: {
          minColumn: 0,
          maxColumn: 4,
          minRow: 0,
          maxRow: 2,
        },
      }

      buttonIndex += buttonsThisPage

      // 最初のページIDを保存（サーフェス設定用）
      if (isFirstPage) {
        ;(pages as { _firstPageId?: string })._firstPageId = pageId
      }
    }

    // 最初のページIDを取得
    const firstPageId =
      (pages as { _firstPageId?: string })._firstPageId || generateNanoId()
    delete (pages as { _firstPageId?: string })._firstPageId

    // 完全なCompanion設定を構築
    const config = {
      version: 9,
      type: 'full',
      companionBuild: '4.1.3+8475-stable-02928d8be8',
      pages,
      triggers: {},
      triggerCollections: [],
      custom_variables: {},
      customVariablesCollections: [],
      expressionVariables: {},
      expressionVariablesCollections: [],
      instances,
      connectionCollections: [],
      surfaces: createSurfaces(firstPageId),
      surfaceGroups: {},
    }

    // JSONをエンコードしてダウンロード
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(config, null, 2)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = `companion_${device}.companionconfig`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 設定を生成
  generateConfig()

  return null
}
