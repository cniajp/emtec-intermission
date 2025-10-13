import fs from 'fs'
import { Speaker, Talk, Track } from '../../src/data/types'

export function exportEventData(finalData: {
  tracks: Track[]
  speakers: Speaker[]
  talks: Talk[]
}) {
  Object.entries(finalData).forEach(([key, value]) => {
    const outputPath = `./src/data/${key}.ts`
    const typeName = key.charAt(0).toUpperCase() + key.slice(1, -1)
    fs.writeFileSync(
      outputPath,
      `import { ${typeName} } from './types'\n\nexport const ${key}: ${typeName}[] = ${JSON.stringify(
        value,
        null,
        2
      )}\n`,
      'utf-8'
    )
    console.log(`Converted data has been saved to ${outputPath}`)
  })
}
