import {
  buildPage3Images,
  isPrecacheTarget,
  publicDirsOf,
  staticConfig,
} from '@/staticConfig'

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

describe('publicDirsOf', () => {
  const source = {
    base: {
      loadingIconSrc: '/ev1/logo.png',
      backgroundSrc: '/ev1/background.png',
      audioSrcs: ['/ev1/bgm/a.mp3', '/shared-bgm/b.mp3'],
      defaultAvatarSrc: '/intermission.png',
      headerLogoSrc: 'https://example.com/title.png',
    },
    page3: { alias: 'ev2/info' },
  }

  it('アセットが置かれている public/ 直下のフォルダを重複なしで返す', () => {
    expect(publicDirsOf([source]).sort()).toEqual(['ev1', 'ev2', 'shared-bgm'])
  })

  it('public/ 直下のファイルと外部 URL は含めない', () => {
    const dirs = publicDirsOf([source])
    expect(dirs).not.toContain('intermission.png')
    expect(dirs).not.toContain('https:')
    expect(dirs).not.toContain('example.com')
  })

  it('現在の設定では各イベントのフォルダになる', () => {
    expect(publicDirsOf(Object.values(staticConfig)).sort()).toEqual(
      [
        staticConfig.break.base.eventAbbr,
        staticConfig.breakDk.base.eventAbbr,
      ].sort()
    )
  })
})

describe('isPrecacheTarget', () => {
  const dirs = ['ev1', 'sounds']

  it('対象フォルダのファイルは残す', () => {
    expect(isPrecacheTarget('public/ev1/info/a.png', dirs)).toBe(true)
    expect(isPrecacheTarget('public/sounds/a.m4a', dirs)).toBe(true)
  })

  it('対象外フォルダのファイルは外す（前方一致で誤って残さない）', () => {
    expect(isPrecacheTarget('public/old/logo.png', dirs)).toBe(false)
    expect(isPrecacheTarget('public/ev10/logo.png', dirs)).toBe(false)
  })

  it('public/ 直下のファイルと public/ 以外は常に残す', () => {
    expect(isPrecacheTarget('public/manifest.json', dirs)).toBe(true)
    expect(isPrecacheTarget('.next/static/chunks/a.js', dirs)).toBe(true)
  })
})
