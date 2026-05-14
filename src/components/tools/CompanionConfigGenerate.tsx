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

export type ActionInfo = {
  definitionId: string
  connectionLabel: string
  options: Record<string, unknown>
  headline?: string
}

export type ButtonCell = {
  text: string
  size: string
  color: number
  bgcolor: number
  actions: ActionInfo[]
  raw: unknown
}

export type CompanionPagePreview = {
  pageNumber: number
  name: string
  buttons: (ButtonCell | null)[][] // [row][col]
}

export type CompanionConfig = {
  json: object
  device: 'gostream' | 'vr6hd'
  pagePreviews: CompanionPagePreview[]
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
  { text: 'Slide', macroIndex: 0, dthCode: '02' },
  { text: 'Futae', macroIndex: 1, dthCode: '03' },
  { text: 'Person', macroIndex: 2, dthCode: '04' },
  { text: 'Logo', macroIndex: 3, dthCode: '00' },
  { text: 'End', macroIndex: 4, dthCode: '09' },
]

// 特殊ボタン定義
const SPECIAL_BUTTONS = {
  count: {
    text: 'Count',
    obsScene: 'CountDown',
    macroIndex: 5,
    dthCode: '01',
  },
  trackA: {
    text: 'TrackA',
    obsScene: 'サイマル',
    macroIndex: 5,
    dthCode: '01',
  },
  slido: {
    text: 'Slido',
    obsScene: '------',
    macroIndex: 6,
    dthCode: '99',
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
  macroIndex: number,
  headline?: string
): object {
  return {
    type: 'action',
    id: generateNanoId(),
    definitionId: 'macroRunStart',
    connectionId,
    options: { MacroIndex: macroIndex },
    upgradeIndex: 5,
    ...(headline ? { headline } : {}),
  }
}

// VR-6HD アクション種別定義
//   dthBase: そのまま実行コマンドとして送出されるDTHベース番号
//   label:   Companion上でのアクション表示ラベル（VR_6HD_HEADLINE_BASE と組み合わせる）
const VR6HD_HEADLINE_BASE = 'VR-6HD'

const VR6HD_ACTION_KINDS = {
  macro: {
    dthBase: '500504',
    label: 'マクロ実行',
  },
  sceneMemory: {
    dthBase: '0A0000',
    label: 'シーンメモリー実行',
  },
} as const

type VR6HDActionKind = keyof typeof VR6HD_ACTION_KINDS

// VR-6HD用アクション作成（2つのsendコマンドを返す）
//   1つ目: LAN接続信号 (id_send='0000')
//   2つ目: DTH:<base>,<dthCode>;  種別に応じてマクロ/シーンメモリー実行
//   dthCode は 0始まり (例 '00' → No.001)
//   ※ 今イベントはシーンメモリー運用のためデフォルト 'sceneMemory'
function createVR6HDActions(
  connectionId: string,
  dthCode: string,
  kind: VR6HDActionKind = 'sceneMemory'
): object[] {
  const number = String(parseInt(dthCode, 10) + 1).padStart(3, '0')
  const { dthBase, label } = VR6HD_ACTION_KINDS[kind]
  return [
    {
      type: 'action',
      id: generateNanoId(),
      definitionId: 'send',
      connectionId,
      options: { id_send: '0000', id_end: '\n' },
      headline: `${VR6HD_HEADLINE_BASE} LAN接続信号`,
    },
    {
      type: 'action',
      id: generateNanoId(),
      definitionId: 'send',
      connectionId,
      options: { id_send: `DTH:${dthBase},${dthCode};`, id_end: '\n' },
      headline: `${VR6HD_HEADLINE_BASE} ${label}: No.${number}`,
    },
  ]
}

// OBS set_sceneアクション作成
function createObsSetSceneAction(
  connectionId: string,
  scene: string,
  headline?: string
): object {
  return {
    type: 'action',
    id: generateNanoId(),
    definitionId: 'set_scene',
    connectionId,
    options: { scene, customSceneName: '' },
    ...(headline ? { headline } : {}),
  }
}

// ボタン定義作成
function createButton(text: string, size: string, actions: object[]): object {
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
  direction: 'pageup' | 'pagedown',
  nowPageNumber: number
): object {
  const isUp = direction === 'pageup'
  const targetPage = nowPageNumber + (isUp ? -1 : 1)
  return {
    type: 'button',
    style: {
      text: isUp ? '↑' : '↓',
      textExpression: false,
      size: 'auto',
      png64: null,
      alignment: 'center:center',
      pngalignment: 'center:center',
      color: 16777215,
      bgcolor: 0,
      show_topbar: 'default',
    },
    options: {
      stepProgression: 'auto',
      stepExpression: '',
      rotaryActions: false,
    },
    feedbacks: [],
    steps: {
      '0': {
        action_sets: {
          down: [
            {
              id: generateNanoId(),
              definitionId: 'set_page_byindex',
              connectionId: 'internal',
              options: {
                controller_from_variable: false,
                controller: 0,
                controller_variable: '0',
                page_from_variable: false,
                page: targetPage,
                page_variable: '1',
              },
              type: 'action',
              children: {},
              headline: isUp
                ? `Go to page ${targetPage}`
                : `Go to page ${targetPage}`,
            },
          ],
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

export function buildCompanionConfig({
  device,
  times,
  specialButtons,
  includeAttack = false,
}: Props): CompanionConfig {
  const generateConfig = (): CompanionConfig => {
    // 接続設定を生成
    const { instances, deviceConnectionId, obsConnectionId } =
      createInstances(device)

    const connectionLabels: Record<string, string> = {
      [deviceConnectionId]:
        device === 'gostream' ? 'gostream-series' : 'VR-6HD',
      [obsConnectionId]: 'obs',
      internal: 'internal',
    }

    // 時刻ボタンと特殊ボタンを結合
    type ButtonItem = {
      type: 'time' | 'special'
      text: string
      obsScene: string
      macroIndex: number
      dthCode: string
    }

    // 時刻ボタンリスト
    const timeButtons: ButtonItem[] = times.map((time) => ({
      type: 'time' as const,
      text: time,
      obsScene: `${time} ~`,
      macroIndex: 5,
      dthCode: '01',
    }))

    // アタック動画ボタンリスト
    const attackButtons: ButtonItem[] = includeAttack
      ? times.map((time) => ({
          type: 'time' as const,
          text: `Video\n${time}`,
          obsScene: `Attack_${time}`,
          macroIndex: 5,
          dthCode: '01',
        }))
      : []

    // ページ計算
    //   row 0: レイアウトボタン (5個固定)
    //   row 1-2 cols 0-2: 時刻 (アタック有効時は row1=時刻 / row2=アタック)
    //   col 3 row 1: Slido > TrackA (有効時のみ)
    //   col 3 row 2: Countdown (有効時のみ)
    //   col 4 row 1: ページ↑ (複数ページ時, 1ページ目以外)
    //   col 4 row 2: ページ↓ (複数ページ時, 最終ページ以外) /
    //                Slido & TrackA 両方有効時は最終ページのみ TrackA
    const TIME_COLS = 3
    const totalTimeSlots = times.length
    const slotsPerPage = includeAttack ? TIME_COLS : TIME_COLS * 2
    const totalPages = Math.max(1, Math.ceil(totalTimeSlots / slotsPerPage))

    type PlaceableItem = {
      text: string
      obsScene: string
      macroIndex: number
      dthCode: string
    }

    const buildActions = (
      item: PlaceableItem,
      deviceHeadline: string
    ): object[] => {
      const actions: object[] = []
      if (device === 'gostream') {
        actions.push(
          createGoStreamAction(
            deviceConnectionId,
            item.macroIndex,
            deviceHeadline
          )
        )
      } else {
        actions.push(...createVR6HDActions(deviceConnectionId, item.dthCode))
      }
      actions.push(
        createObsSetSceneAction(
          obsConnectionId,
          item.obsScene,
          `OBSシーン呼び出し: ${item.obsScene}`
        )
      )
      return actions
    }

    const makeBtn = (item: PlaceableItem, deviceHeadline: string): object =>
      createButton(item.text, '24', buildActions(item, deviceHeadline))

    const pages: Record<string, object> = {}
    const pagePreviews: CompanionPagePreview[] = []
    let timeIndex = 0

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageId = generateNanoId()
      const isFirstPage = pageNum === 1
      const isLastPage = pageNum === totalPages
      const hasMultiplePages = totalPages > 1

      const controls: Record<string, Record<string, object>> = {}

      // Row 0: レイアウトボタン（固定 5列）
      controls['0'] = {}
      LAYOUT_BUTTONS.forEach((btn, col) => {
        const actions: object[] = []
        const layoutHeadline = `Layout: ${btn.text}`
        if (device === 'gostream') {
          actions.push(
            createGoStreamAction(
              deviceConnectionId,
              btn.macroIndex,
              layoutHeadline
            )
          )
        } else {
          actions.push(...createVR6HDActions(deviceConnectionId, btn.dthCode))
        }
        actions.push(
          createObsSetSceneAction(obsConnectionId, '------', 'Clear OBS scene')
        )
        controls['0'][col.toString()] = createButton(btn.text, '18', actions)
      })

      controls['1'] = {}
      controls['2'] = {}

      // 時刻 / アタックを cols 0-2 に配置
      const slotsThisPage = Math.min(slotsPerPage, totalTimeSlots - timeIndex)

      if (includeAttack) {
        // 3列: row1 = 時刻, row2 = アタック
        for (let i = 0; i < slotsThisPage; i++) {
          const timeBtn = timeButtons[timeIndex + i]
          const attackBtn = attackButtons[timeIndex + i]
          controls['1'][i.toString()] = makeBtn(timeBtn, `Time ${timeBtn.text}`)
          controls['2'][i.toString()] = makeBtn(
            attackBtn,
            `Attack ${timeBtn.text}`
          )
        }
      } else {
        // 6スロット: row1 cols 0-2, row2 cols 0-2 の順
        for (let i = 0; i < slotsThisPage; i++) {
          const row = i < TIME_COLS ? '1' : '2'
          const col = (i % TIME_COLS).toString()
          const timeBtn = timeButtons[timeIndex + i]
          controls[row][col] = makeBtn(timeBtn, `Time ${timeBtn.text}`)
        }
      }
      timeIndex += slotsThisPage

      // 固定枠 [3][1]: Slido が有効ならSlido、なければ TrackA を割当
      let trackAFixedAtRow1Col3 = false
      if (specialButtons.slido) {
        const sb = SPECIAL_BUTTONS.slido
        controls['1']['3'] = makeBtn(sb, `Special: ${sb.text}`)
      } else if (specialButtons.trackA) {
        const sb = SPECIAL_BUTTONS.trackA
        controls['1']['3'] = makeBtn(sb, `Special: ${sb.text}`)
        trackAFixedAtRow1Col3 = true
      }

      // 固定枠 [3][2]: Countdown
      if (specialButtons.count) {
        const sb = SPECIAL_BUTTONS.count
        controls['2']['3'] = makeBtn(sb, `Special: ${sb.text}`)
      }

      // [4][1] / [4][2]: ページナビ + 最終ページ TrackA フォールバック
      if (hasMultiplePages && !isFirstPage) {
        controls['1']['4'] = createPageNavigationButton('pageup', pageNum)
      }
      if (hasMultiplePages && !isLastPage) {
        controls['2']['4'] = createPageNavigationButton('pagedown', pageNum)
      } else if (
        isLastPage &&
        specialButtons.slido &&
        specialButtons.trackA &&
        !trackAFixedAtRow1Col3
      ) {
        // Slido が [3][1] を占有しているので、TrackA は最終ページの [4][2] に
        const sb = SPECIAL_BUTTONS.trackA
        controls['2']['4'] = makeBtn(sb, `Special: ${sb.text}`)
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

      pagePreviews.push({
        pageNumber: pageNum,
        name: `Page${pageNum}`,
        buttons: extractPreviewGrid(controls, connectionLabels),
      })

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

    return { json: config, device, pagePreviews }
  }

  return generateConfig()
}

type RawButton = {
  style: {
    text: string
    size: string
    color?: number
    bgcolor?: number
  }
  steps?: {
    '0'?: {
      action_sets?: {
        down?: {
          definitionId: string
          connectionId: string
          options: Record<string, unknown>
          headline?: string
        }[]
      }
    }
  }
}

function extractPreviewGrid(
  controls: Record<string, Record<string, object>>,
  connectionLabels: Record<string, string>
): (ButtonCell | null)[][] {
  const grid: (ButtonCell | null)[][] = [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]
  for (const [rowStr, colsObj] of Object.entries(controls)) {
    const row = parseInt(rowStr)
    for (const [colStr, btn] of Object.entries(colsObj)) {
      const col = parseInt(colStr)
      const raw = btn as RawButton
      const downActions = raw.steps?.['0']?.action_sets?.down ?? []
      const actions: ActionInfo[] = downActions.map((a) => ({
        definitionId: a.definitionId,
        connectionLabel: connectionLabels[a.connectionId] ?? a.connectionId,
        options: a.options,
        headline: a.headline,
      }))
      grid[row][col] = {
        text: raw.style.text,
        size: raw.style.size,
        color: raw.style.color ?? 16777215,
        bgcolor: raw.style.bgcolor ?? 0,
        actions,
        raw: btn,
      }
    }
  }
  return grid
}

export function downloadCompanionConfig(config: CompanionConfig) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(config.json, null, 2)
  )}`
  const link = document.createElement('a')
  link.href = jsonString
  link.download = `companion_${config.device}.companionconfig`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
