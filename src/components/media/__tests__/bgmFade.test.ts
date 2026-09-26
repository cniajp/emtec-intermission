import { fadeProgress, shouldStartCrossfade } from '@/components/media/bgmFade'

describe('shouldStartCrossfade', () => {
  it('残りが fadeSeconds 以下になったら true', () => {
    expect(shouldStartCrossfade(97, 100, 2)).toBe(false)
    expect(shouldStartCrossfade(98, 100, 2)).toBe(true)
    expect(shouldStartCrossfade(100, 100, 2)).toBe(true)
  })

  it('fadeSeconds=0 なら false（ended で曲送り）', () => {
    expect(shouldStartCrossfade(100, 100, 0)).toBe(false)
  })

  it('duration が不明なら false', () => {
    expect(shouldStartCrossfade(50, NaN, 2)).toBe(false)
    expect(shouldStartCrossfade(50, Infinity, 2)).toBe(false)
  })
})

describe('fadeProgress', () => {
  it('経過秒数に比例して 0 → 1', () => {
    expect(fadeProgress(0, 2)).toBe(0)
    expect(fadeProgress(1, 2)).toBe(0.5)
    expect(fadeProgress(2, 2)).toBe(1)
    expect(fadeProgress(10, 2)).toBe(1)
  })

  it('fadeSeconds=0 なら常に 1', () => {
    expect(fadeProgress(0, 0)).toBe(1)
  })
})
