// Cloudflare Pages Function for CORS proxy
// This proxies requests to event.cloudnativedays.jp to avoid CORS issues

const TARGET_API_BASE = 'https://event.cloudnativedays.jp'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

export async function onRequest(context: {
  request: Request
  params: { path?: string[] }
}): Promise<Response> {
  const { request, params } = context

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Build the target URL
    const url = new URL(request.url)
    const pathSegments = params.path || []
    const targetPath = pathSegments.join('/')
    const targetUrl = `${TARGET_API_BASE}/${targetPath}${url.search}`

    console.log('Proxying request to:', targetUrl)

    // Forward the request
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward some original headers if needed
        ...(request.headers.get('Authorization') && {
          Authorization: request.headers.get('Authorization')!,
        }),
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    })

    // Fetch from the target API
    const response = await fetch(proxyRequest)

    // Get response body
    const responseBody = await response.text()

    // Return response with CORS headers
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response(
      JSON.stringify({
        error: 'Proxy error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
