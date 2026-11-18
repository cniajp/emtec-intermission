import { makeTrackOnlyView } from '../trackOnlyView'

const tracks = [
  { id: 1, name: 'Park', hashTag: 'jisabakan' },
  { id: 2, name: 'Hall' },
]

describe('makeTrackOnlyView', () => {
  it('トラック名だけでヘッダーに必要な情報がそろう', () => {
    const view = makeTrackOnlyView({ trackName: 'A' })
    expect(view.selectedTrack.name).toBe('A')
    expect(view.talksLeftInSameTrack()).toHaveLength(1)
  })

  it('trackId を渡すとトラック別の Page3 画像を引ける', () => {
    const view = makeTrackOnlyView({ trackName: 'A', trackId: 3 })
    expect(view.selectedTalk.trackId).toBe(3)
    expect(view.selectedTrack.id).toBe(3)
  })

  it('既知のトラックは名前（大文字小文字を区別しない）で引き、hashTag と ID を引き継ぐ', () => {
    const view = makeTrackOnlyView({ trackName: 'park', tracks })
    expect(view.selectedTrack).toEqual({
      id: 1,
      name: 'park',
      hashTag: 'jisabakan',
    })
    expect(view.selectedTalk.trackId).toBe(1)
  })

  it('既知のトラックは ID でも引ける（名前は定義のものを使う）', () => {
    const view = makeTrackOnlyView({ trackId: 2, tracks })
    expect(view.selectedTrack.name).toBe('Hall')
  })

  it('何も渡さなくても壊れない（トラック名は空）', () => {
    const view = makeTrackOnlyView({})
    expect(view.selectedTrack.name).toBe('')
    expect(view.talksLeftInSameTrack()).toHaveLength(1)
  })
})
