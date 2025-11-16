import { NextRequest } from 'next/server'

export const runtime = 'edge'

export default function handler(_req: NextRequest) {
  const now = new Date()

  return new Response(
    JSON.stringify({
      timestamp: now.toISOString(),
      timezone: 'Asia/Tokyo',
      unix: Math.floor(now.getTime() / 1000),
      milliseconds: now.getTime(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
