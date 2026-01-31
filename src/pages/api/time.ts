import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const now = new Date()

  res.status(200).json({
    timestamp: now.toISOString(),
    timezone: 'Asia/Tokyo',
    unix: Math.floor(now.getTime() / 1000),
    milliseconds: now.getTime(),
  })
}
