import { buildPage3Images } from '@/staticConfig'

describe('buildPage3Images', () => {
  it('inserts が undefined の場合は common をそのまま返す', () => {
    expect(buildPage3Images(['a.jpg', 'b.jpg'], undefined)).toEqual([
      'a.jpg',
      'b.jpg',
    ])
  })

  it('空 inserts のときも common をそのまま返す', () => {
    expect(buildPage3Images(['a.jpg'], [])).toEqual(['a.jpg'])
  })

  it('1件挿入: position=2 は index=1 に挿入', () => {
    expect(
      buildPage3Images(
        ['a.jpg', 'b.jpg', 'c.jpg'],
        [{ position: 2, src: 'x.jpg' }]
      )
    ).toEqual(['a.jpg', 'x.jpg', 'b.jpg', 'c.jpg'])
  })

  it('position が範囲外なら 0 と length にクランプされる', () => {
    // position=0 → index=0 に挿入
    expect(
      buildPage3Images(['a.jpg'], [{ position: 0, src: 'x.jpg' }])
    ).toEqual(['x.jpg', 'a.jpg'])

    // position=99 → 末尾に挿入
    expect(
      buildPage3Images(['a.jpg'], [{ position: 99, src: 'y.jpg' }])
    ).toEqual(['a.jpg', 'y.jpg'])
  })

  it('複数 inserts は position 昇順で順次適用される', () => {
    const result = buildPage3Images(
      ['a.jpg', 'b.jpg', 'c.jpg'],
      [
        { position: 3, src: 'y.jpg' },
        { position: 1, src: 'x.jpg' },
      ]
    )
    // position=1 (先) → ['x','a','b','c'], position=3 → index=2 に挿入 → ['x','a','y','b','c']
    expect(result).toEqual(['x.jpg', 'a.jpg', 'y.jpg', 'b.jpg', 'c.jpg'])
  })
})
