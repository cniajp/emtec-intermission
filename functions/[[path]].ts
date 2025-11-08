export async function onRequest(context: {
  request: Request
  env: {
    API_BASE_URL?: string
  }
}): Promise<Response> {
  const { request, env } = context

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const url = new URL(request.url)
  const apiPath = url.pathname

  const targetApiUrl = env.API_BASE_URL || 'https://event.cloudnativedays.jp'
  const targetUrl = new URL(
    apiPath,
    targetApiUrl.endsWith('/') ? targetApiUrl : targetApiUrl + '/'
  )

  if (url.search) {
    targetUrl.search = url.search
  }

  try {
    const response = await fetch(targetUrl.toString())

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response('Proxy Error', { status: 500 })
  }
}