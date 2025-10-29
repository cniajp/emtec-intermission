export const onRequest = async () => {
  const now = new Date()

  // Convert to JST
  const jstTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
  )

  return new Response(
    JSON.stringify({
      timestamp: jstTime.toISOString(),
      timezone: 'Asia/Tokyo',
      unix: Math.floor(jstTime.getTime() / 1000),
      milliseconds: jstTime.getTime(),
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
