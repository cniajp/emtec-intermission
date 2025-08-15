import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const items = await fs.readdir(publicDir, { withFileTypes: true })

    // ***YYYY形式のディレクトリをフィルタリング
    const eventDirs = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .filter((name) => /^[a-z]+\d{4}$/.test(name))
      .sort()

    // イベント名を推測してレスポンスを作成
    const events = eventDirs.map((abbr) => {
      const eventName = getEventName(abbr)
      return { abbr, name: eventName }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error reading public directory:', error)
    return NextResponse.json([], { status: 500 })
  }
}

function getEventName(abbr: string): string {
  const year = abbr.slice(-4)
  const prefix = abbr.slice(0, -4)

  const eventMap: Record<string, string> = {
    cnds: 'CloudNative Days Summer',
    cndt: 'CloudNative Days Tokyo',
    cndw: 'CloudNative Days Winter',
    pek: 'Platform Engineering Kaigi',
  }

  const baseName = eventMap[prefix] || prefix.toUpperCase()
  return `${baseName} ${year}`
}
