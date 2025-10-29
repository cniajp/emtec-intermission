import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  timestamp: string
  timezone: string
  unix: number
  milliseconds: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const now = new Date()

  // Convert to JST
  const jstTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
  )

  res.status(200).json({
    timestamp: jstTime.toISOString(),
    timezone: 'Asia/Tokyo',
    unix: Math.floor(jstTime.getTime() / 1000),
    milliseconds: jstTime.getTime(),
  })
}
