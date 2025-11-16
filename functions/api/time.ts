export const onRequest = async () => {
  const now = new Date()

  return new Response(
    JSON.stringify({
      timestamp: now.toISOString(),
      timezone: 'Asia/Tokyo',
      unix: Math.floor(now.getTime() / 1000),
      milliseconds: now.getTime(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
