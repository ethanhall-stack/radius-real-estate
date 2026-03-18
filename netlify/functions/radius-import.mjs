// Netlify serverless function — proxies lead data to Radius Office API.
// The RADIUS_SECURE_ID env var is set in Netlify dashboard → Site settings
// → Environment variables. It never touches the browser.

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const secureId = process.env.RADIUS_SECURE_ID || process.env.VITE_RADIUS_SECURE_ID
  if (!secureId) {
    console.error('[radius-import] RADIUS_SECURE_ID env var is not set in Netlify')
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.text()

    const radiusRes = await fetch('https://api1.agentdesks.com/v3.0/clients/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'secure-id': secureId,
      },
      body,
    })

    const text = await radiusRes.text()
    return new Response(text, {
      status: radiusRes.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[radius-import] Fetch failed:', err)
    return new Response(JSON.stringify({ error: 'Upstream request failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  path: '/api/radius-import',
}
