import {
  companionOptionsFromQuery,
  companionOptionsToQuery,
  type CompanionOptions,
} from '@/components/tools/CompanionConfigGenerate'
import { sceneTimesOf } from '@/components/tools/obsSceneNames'

describe('companionOptions の URL 受け渡し', () => {
  it('toQuery → fromQuery で元に戻る', () => {
    const options: CompanionOptions = {
      device: 'vr6hd',
      specialButtons: { count: true, trackA: false, slido: true },
      includeAttack: true,
    }
    expect(companionOptionsFromQuery(companionOptionsToQuery(options))).toEqual(
      options
    )
  })

  it('未指定のパラメータは gostream / すべて OFF', () => {
    expect(companionOptionsFromQuery({})).toEqual({
      device: 'gostream',
      specialButtons: { count: false, trackA: false, slido: false },
      includeAttack: false,
    })
  })
})

describe('sceneTimesOf', () => {
  // 実行環境のタイムゾーンに依存しないよう、ローカル時刻から startTime を作る
  const at = (h: number, m: number) => new Date(2026, 8, 26, h, m).toISOString()

  it('開始順に並べて HH:mm にする', () => {
    expect(
      sceneTimesOf([{ startTime: at(13, 0) }, { startTime: at(9, 5) }])
    ).toEqual(['09:05', '13:00'])
  })
})
