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
//   2つ目: DTH:<base>,<dthCode>;  種別に応じてマクロ/シーンメモリー呼び出し
//   dthCode は 0始まり (例 '00' → No.001)
function createVR6HDActions(
  connectionId: string,
  dthCode: string,
  kind: VR6HDActionKind = 'macro'
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
      dthCode: '05',
    }))

    // アタック動画ボタンリスト
    const attackButtons: ButtonItem[] = includeAttack
      ? times.map((time) => ({
          type: 'time' as const,
          text: `Video\n${time}`,
          obsScene: `Attack_${time}`,
          macroIndex: 5,
          dthCode: '05',
        }))
      : []

    // 特殊ボタンリスト
    const specialButtonItems: ButtonItem[] = []
    if (specialButtons.count) {
      specialButtonItems.push({
        type: 'special',
        ...SPECIAL_BUTTONS.count,
      })
    }
    if (specialButtons.trackA) {
      specialButtonItems.push({
        type: 'special',
        ...SPECIAL_BUTTONS.trackA,
      })
    }
    if (specialButtons.slido) {
      specialButtonItems.push({
        type: 'special',
        ...SPECIAL_BUTTONS.slido,
      })
    }

    // ページ計算
    // row 0: レイアウトボタン (5個)
    // アタック動画有効時: row 1 に時刻、row 2 にアタック（縦揃え）
    // アタック動画無効時: row 1, row 2 に順番配置

    const totalTimeSlots = times.length
    const totalSpecialButtons = specialButtonItems.length

    // 複数ページが必要かを判定
    // アタック有効時: 4スロット/ページ（複数ページの場合）、5スロット/ページ（単一ページ）
    // アタック無効時: 8ボタン/ページ（複数ページの場合）、10ボタン/ページ（単一ページ）
    let totalPages: number
    let slotsPerPage: number

    if (includeAttack) {
      // アタック有効時は時刻スロット単位で計算
      // 特殊ボタンは最後のページのrow 2の空きに配置
      const needsMultiplePages = totalTimeSlots > 4
      slotsPerPage = needsMultiplePages ? 4 : 5
      totalPages = Math.max(1, Math.ceil(totalTimeSlots / slotsPerPage))
    } else {
      // アタック無効時は従来通り
      const totalButtons = totalTimeSlots + totalSpecialButtons
      const needsMultiplePages = totalButtons > 8
      slotsPerPage = needsMultiplePages ? 8 : 10
      totalPages = Math.max(1, Math.ceil(totalButtons / slotsPerPage))
    }

    const pages: Record<string, object> = {}
    const pagePreviews: CompanionPagePreview[] = []
    let timeIndex = 0
    let specialIndex = 0

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
        const layoutHeadline = `Layout: ${btn.text}`

        // デバイス用アクション
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

        // OBS用アクション
        actions.push(
          createObsSetSceneAction(obsConnectionId, '------', 'Clear OBS scene')
        )

        controls['0'][col.toString()] = createButton(btn.text, '18', actions)
      })

      // 複数ページの場合は col 4 をナビゲーションに使用
      const maxColsPerRow = hasMultiplePages ? 4 : 5

      controls['1'] = {}
      controls['2'] = {}

      if (includeAttack) {
        // アタック有効時: row 1 に時刻、row 2 にアタック（縦揃え）
        const timeSlotsThisPage = Math.min(
          maxColsPerRow,
          totalTimeSlots - timeIndex
        )

        for (let i = 0; i < timeSlotsThisPage; i++) {
          const timeBtn = timeButtons[timeIndex + i]
          const attackBtn = attackButtons[timeIndex + i]

          // row 1: 時刻ボタン
          const timeActions: object[] = []
          const timeHeadline = `Time ${timeBtn.text}`
          if (device === 'gostream') {
            timeActions.push(
              createGoStreamAction(
                deviceConnectionId,
                timeBtn.macroIndex,
                timeHeadline
              )
            )
          } else {
            timeActions.push(
              ...createVR6HDActions(deviceConnectionId, timeBtn.dthCode)
            )
          }
          timeActions.push(
            createObsSetSceneAction(
              obsConnectionId,
              timeBtn.obsScene,
              `OBSシーン呼び出し: ${timeBtn.obsScene}`
            )
          )
          controls['1'][i.toString()] = createButton(
            timeBtn.text,
            '24',
            timeActions
          )

          // row 2: アタック動画ボタン
          const attackActions: object[] = []
          const attackHeadline = `Attack ${timeBtn.text}`
          if (device === 'gostream') {
            attackActions.push(
              createGoStreamAction(
                deviceConnectionId,
                attackBtn.macroIndex,
                attackHeadline
              )
            )
          } else {
            attackActions.push(
              ...createVR6HDActions(deviceConnectionId, attackBtn.dthCode)
            )
          }
          attackActions.push(
            createObsSetSceneAction(
              obsConnectionId,
              attackBtn.obsScene,
              `OBSシーン呼び出し: ${attackBtn.obsScene}`
            )
          )
          controls['2'][i.toString()] = createButton(
            attackBtn.text,
            '24',
            attackActions
          )
        }

        // 最終ページで特殊ボタンをrow 2の空きに配置
        if (isLastPage) {
          let specialCol = timeSlotsThisPage
          while (
            specialIndex < totalSpecialButtons &&
            specialCol < maxColsPerRow
          ) {
            const specialBtn = specialButtonItems[specialIndex]
            const specialActions: object[] = []
            const specialHeadline = `Special: ${specialBtn.text}`
            if (device === 'gostream') {
              specialActions.push(
                createGoStreamAction(
                  deviceConnectionId,
                  specialBtn.macroIndex,
                  specialHeadline
                )
              )
            } else {
              specialActions.push(
                ...createVR6HDActions(deviceConnectionId, specialBtn.dthCode)
              )
            }
            specialActions.push(
              createObsSetSceneAction(
                obsConnectionId,
                specialBtn.obsScene,
                `OBSシーン呼び出し: ${specialBtn.obsScene}`
              )
            )
            controls['2'][specialCol.toString()] = createButton(
              specialBtn.text,
              '24',
              specialActions
            )
            specialCol++
            specialIndex++
          }
        }

        timeIndex += timeSlotsThisPage
      } else {
        // アタック無効時: 従来の順番配置
        const allButtons = [...timeButtons, ...specialButtonItems]
        const buttonsThisPage = Math.min(
          slotsPerPage,
          allButtons.length - timeIndex
        )

        // row 1のボタン配置
        for (let i = 0; i < Math.min(maxColsPerRow, buttonsThisPage); i++) {
          if (timeIndex + i < allButtons.length) {
            const item = allButtons[timeIndex + i]
            const actions: object[] = []
            const itemHeadline =
              item.type === 'time'
                ? `Time ${item.text}`
                : `Special: ${item.text}`

            if (device === 'gostream') {
              actions.push(
                createGoStreamAction(
                  deviceConnectionId,
                  item.macroIndex,
                  itemHeadline
                )
              )
            } else {
              actions.push(
                ...createVR6HDActions(deviceConnectionId, item.dthCode)
              )
            }
            actions.push(
              createObsSetSceneAction(
                obsConnectionId,
                item.obsScene,
                `OBSシーン呼び出し: ${item.obsScene}`
              )
            )

            controls['1'][i.toString()] = createButton(item.text, '24', actions)
          }
        }

        // row 2のボタン配置
        const row2Start = maxColsPerRow
        for (let i = 0; i < maxColsPerRow; i++) {
          const itemIdx = timeIndex + row2Start + i
          if (itemIdx < allButtons.length && i + row2Start < buttonsThisPage) {
            const item = allButtons[itemIdx]
            const actions: object[] = []
            const itemHeadline =
              item.type === 'time'
                ? `Time ${item.text}`
                : `Special: ${item.text}`

            if (device === 'gostream') {
              actions.push(
                createGoStreamAction(
                  deviceConnectionId,
                  item.macroIndex,
                  itemHeadline
                )
              )
            } else {
              actions.push(
                ...createVR6HDActions(deviceConnectionId, item.dthCode)
              )
            }
            actions.push(
              createObsSetSceneAction(
                obsConnectionId,
                item.obsScene,
                `OBSシーン呼び出し: ${item.obsScene}`
              )
            )

            controls['2'][i.toString()] = createButton(item.text, '24', actions)
          }
        }

        timeIndex += buttonsThisPage
      }

      // ページナビゲーションボタン (col 4 に縦配置)
      if (hasMultiplePages) {
        // row 1 col 4: pageup（戻る）- 1ページ目以外で表示
        if (!isFirstPage) {
          // targetPageIndex: 前のページ
          controls['1']['4'] = createPageNavigationButton('pageup', pageNum)
        }
        // row 2 col 4: pagedown（次へ）- 最終ページ以外で表示
        if (!isLastPage) {
          // targetPageIndex: 次のページ
          controls['2']['4'] = createPageNavigationButton('pagedown', pageNum)
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
