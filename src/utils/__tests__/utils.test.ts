import { summarizeSpeakerNames } from '../utils'

describe('summarizeSpeakerNames', () => {
  it('0 名なら空文字', () => {
    expect(summarizeSpeakerNames([])).toBe('')
  })

  it('1 名ならそのまま', () => {
    expect(summarizeSpeakerNames(['Hirotaka Torigoe'])).toBe('Hirotaka Torigoe')
  })

  it('2 名なら全員をカンマ区切りで出す', () => {
    expect(summarizeSpeakerNames(['Hirotaka Torigoe', 'Koya Matsuda'])).toBe(
      'Hirotaka Torigoe, Koya Matsuda'
    )
  })

  it('3 名以上は先頭 1 名と「他N名」にまとめる', () => {
    expect(
      summarizeSpeakerNames([
        'Hirotaka Torigoe',
        'Koya Matsuda',
        'Fumiaki Kanayama',
      ])
    ).toBe('Hirotaka Torigoe 他2名')
  })

  it('名前が未設定の登壇者は数えない', () => {
    expect(summarizeSpeakerNames(['A', undefined, 'B', ''])).toBe('A, B')
  })
})
