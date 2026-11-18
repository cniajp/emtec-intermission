import { strFromU8, unzipSync } from 'fflate'
import {
  isAllTracks,
  tracksWithTalks,
  zipFiles,
} from '@/components/tools/exportAll'
import {
  buildCompanionConfig,
  companionConfigFile,
  companionZipName,
} from '@/components/tools/CompanionConfigGenerate'
import { obsSceneZipName } from '@/components/tools/ObsSceneGenerate'

describe('tracksWithTalks', () => {
  const tracks = [
    { id: 3, name: 'C' },
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ]

  it('トークのあるトラックだけを id 順で返す', () => {
    expect(tracksWithTalks(tracks, [{ trackId: 3 }, { trackId: 1 }])).toEqual([
      { id: 1, name: 'A' },
      { id: 3, name: 'C' },
    ])
  })

  it('トークが無ければ空', () => {
    expect(tracksWithTalks(tracks, [])).toEqual([])
  })
})

describe('isAllTracks', () => {
  it('trackId=all だけが全トラック', () => {
    expect(isAllTracks('all')).toBe(true)
    expect(isAllTracks('1')).toBe(false)
    expect(isAllTracks(undefined)).toBe(false)
  })
})

describe('zipFiles', () => {
  it('トラックごとのファイルを1つの ZIP にまとめ、中身はそのまま取り出せる', () => {
    const files = ['A', 'ホール'].map((trackName) =>
      companionConfigFile(
        buildCompanionConfig({
          device: 'vr6hd',
          specialButtons: { count: true },
          times: ['10:00', '11:00'],
        }),
        { eventAbbr: 'cndw2026', confDay: '1', trackName }
      )
    )
    const unzipped = unzipSync(zipFiles(files))

    expect(Object.keys(unzipped)).toEqual([
      'companion_cndw2026_day1_trackA_vr6hd.companionconfig',
      'companion_cndw2026_day1_trackホール_vr6hd.companionconfig',
    ])
    files.forEach((file) => {
      expect(strFromU8(unzipped[file.name])).toBe(file.text)
    })
  })
})

describe('ZIP のファイル名', () => {
  it('OBS / Companion とも day と all を含む', () => {
    expect(obsSceneZipName('cndw2026', '2')).toBe(
      'obs_scene_cndw2026_day2_all.zip'
    )
    expect(companionZipName('cndw2026', '2', 'gostream')).toBe(
      'companion_cndw2026_day2_all_gostream.zip'
    )
  })
})
