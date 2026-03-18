import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const TOKEN_URL = 'https://authenticate.constellation1apis.com/oauth2/token'
const API_BASE  = 'https://listings.cdatalabs.com/odata'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80',
]

const PROPERTY_TYPE_MAP = {
  'Single Family': 'Single Family Residence',
  Condominium:     'Condominium',
  Penthouse:       'Penthouse',
  Estate:          'Single Family Residence',
  Villa:           'Single Family Residence',
}

export default defineConfig(({ mode }) => {
  // '' prefix loads ALL env vars (not just VITE_) for server-side use
  const env = loadEnv(mode, process.cwd(), '')

  // ── IDX dev middleware ────────────────────────────────────────────────────
  // Mirrors the Netlify function so `npm run dev` works without netlify dev.
  let devTokenCache = { token: null, expiresAt: 0 }

  async function getDevToken() {
    if (devTokenCache.token && Date.now() < devTokenCache.expiresAt) return devTokenCache.token
    const { CONSTELLATION1_CLIENT_ID: clientId, CONSTELLATION1_CLIENT_SECRET: clientSecret } = env
    if (!clientId || !clientSecret) throw new Error('IDX credentials not set in .env')
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${credentials}` },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, scope: 'https://api.constellation1apis.com/Api.Read' }).toString(),
    })
    if (!res.ok) throw new Error(`IDX token fetch failed: ${res.status}`)
    const data = await res.json()
    devTokenCache = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
    return devTokenCache.token
  }

  async function devFetchProperties(params, token) {
    const filters = [`StandardStatus eq 'Active'`, `ListPrice ge ${params.minPrice || 500000}`, `ListPrice le ${params.maxPrice || 50000000}`, `BedroomsTotal ge 1`]
    if (params.city)        filters.push(`City eq '${params.city.trim()}'`)
    if (params.beds)        filters.push(`BedroomsTotal ge ${params.beds}`)
    if (params.leaseOnly === 'true') filters.push(`contains(PropertyType,'Lease')`)
    const mapped = PROPERTY_TYPE_MAP[params.propertyType]
    if (mapped) filters.push(`PropertySubType eq '${mapped}'`)

    const url = new URL(`${API_BASE}/Property`)
    url.searchParams.set('$filter',     filters.join(' and '))
    url.searchParams.set('$top',        params.top  || '12')
    url.searchParams.set('$skip',       params.skip || '0')
    url.searchParams.set('$select',     'ListingKey,UnparsedAddress,City,StateOrProvince,ListPrice,BedroomsTotal,BathroomsTotalInteger,LivingArea,StandardStatus,PropertySubType,DaysOnMarket,PropertyType,PublicRemarks')
    url.searchParams.set('$count',      'true')
    url.searchParams.set('$ignorenulls','true')
    url.searchParams.set('$orderby',    'ListPrice desc')

    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}`, 'Accept-Encoding': 'gzip, deflate, br' } })
    if (!res.ok) throw new Error(`Properties fetch failed (${res.status})`)
    return res.json()
  }

  async function devFetchMedia(listingKeys, token) {
    if (!listingKeys.length) return {}
    const keyList = listingKeys.map((k) => `'${k}'`).join(',')
    const url = new URL(`${API_BASE}/Media`)
    url.searchParams.set('$filter',     `ResourceRecordKey in (${keyList})`)
    url.searchParams.set('$select',     'ResourceRecordKey,MediaURL,Order')
    url.searchParams.set('$top',        String(listingKeys.length * 3))
    url.searchParams.set('$ignorenulls','true')
    url.searchParams.set('$orderby',    'ResourceRecordKey,Order asc')
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return {}
    const data = await res.json()
    const mediaMap = {}
    for (const item of data.value || []) {
      if (!mediaMap[item.ResourceRecordKey] && item.MediaURL) mediaMap[item.ResourceRecordKey] = item.MediaURL
    }
    return mediaMap
  }

  function normalizeProperty(prop, mediaMap, index) {
    const tag     = (prop.DaysOnMarket ?? 999) <= 7 ? 'New Listing' : null
    const isLease = (prop.PropertyType || '').toLowerCase().includes('lease')
    return {
      id:          prop.ListingKey,
      address:     prop.UnparsedAddress || '',
      city:        prop.City || '',
      state:       prop.StateOrProvince || '',
      price:       prop.ListPrice || 0,
      beds:        prop.BedroomsTotal || 0,
      baths:       prop.BathroomsTotalInteger || 0,
      sqft:        prop.LivingArea || 0,
      type:        isLease ? 'For Lease' : 'For Sale',
      tag,
      image:       mediaMap[prop.ListingKey] || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
      description: prop.PublicRemarks || '',
    }
  }

  const idxDevPlugin = {
    name: 'idx-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/idx-listings', async (req, res) => {
        try {
          const params = Object.fromEntries(new URLSearchParams(req.url.split('?')[1] || ''))
          const token  = await getDevToken()
          const listingsData = await devFetchProperties(params, token)
          const rawProps     = listingsData.value || []
          const listingKeys  = rawProps.map((p) => p.ListingKey).filter(Boolean)
          const mediaMap     = await devFetchMedia(listingKeys, token)
          const allProps     = rawProps.map((p, i) => normalizeProperty(p, mediaMap, i))
          const seen         = new Set()
          const properties   = allProps.filter((p) => { const k = `${p.address}|${p.price}`; if (seen.has(k)) return false; seen.add(k); return true })
          const body = JSON.stringify({ properties, total: listingsData['@odata.count'] || listingsData['@odata.totalCount'] || properties.length })
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'public, max-age=300')
          res.end(body)
        } catch (err) {
          console.error('[idx-dev]', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }

  return {
    plugins: [react(), idxDevPlugin],
    server: {
      proxy: {
        // In dev, /api/radius-import is forwarded to Radius server-side
        '/api/radius-import': {
          target: 'https://api1.agentdesks.com',
          changeOrigin: true,
          rewrite: () => '/v3.0/clients/import',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('secure-id', env.VITE_RADIUS_SECURE_ID ?? '')
            })
          },
        },
      },
    },
  }
})
