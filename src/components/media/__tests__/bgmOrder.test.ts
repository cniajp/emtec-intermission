import { makeBgmOrder } from '@/components/media/bgmOrder'

describe('makeBgmOrder', () => {
  it('shuffle=false なら配列順', () => {
    expect(makeBgmOrder(3, false)).toEqual([0, 1, 2])
  })

  it('shuffle=true でも全曲を1回ずつ含む', () => {
    for (let n = 0; n < 50; n++) {
      expect([...makeBgmOrder(5, true)].sort()).toEqual([0, 1, 2, 3, 4])
    }
  })

  it('random に従ってシャッフルする', () => {
    // 常に 0 を返すと Fisher-Yates は [1, 2, 0] になる
    expect(makeBgmOrder(3, true, undefined, () => 0)).toEqual([1, 2, 0])
  })

  it('avoidFirst の曲は先頭に来ない', () => {
    // () => 0 だと先頭は 1 になるので、1 を避けさせる
    expect(makeBgmOrder(3, true, 1, () => 0)).toEqual([0, 2, 1])
    for (let n = 0; n < 50; n++) {
      expect(makeBgmOrder(3, true, 2)[0]).not.toBe(2)
    }
  })

  it('1 曲なら avoidFirst があってもそのまま', () => {
    expect(makeBgmOrder(1, true, 0)).toEqual([0])
  })
})
