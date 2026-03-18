// Client-side IDX service — calls the server proxy at /api/idx-listings.
// Auth and credentials are handled entirely server-side.

const IDX_ENDPOINT = '/api/idx-listings'

function parsePriceRange(str) {
  if (!str || str === 'Any Price') return {}
  const toNum = (s) => {
    if (!s) return null
    const n = parseFloat(s.replace(/[$,\s]/g, ''))
    if (/[Mm]/.test(s)) return Math.round(n * 1_000_000)
    if (/[Kk]/.test(s)) return Math.round(n * 1_000)
    return Math.round(n)
  }
  if (str.includes('+')) return { minPrice: toNum(str.replace('+', '')) }
  const parts = str.split(/[-–—]/).map((p) => p.trim())
  return {
    ...(toNum(parts[0]) && { minPrice: toNum(parts[0]) }),
    ...(toNum(parts[1]) && { maxPrice: toNum(parts[1]) }),
  }
}

function parseBeds(str) {
  if (!str || str === 'Any Beds') return {}
  const num = parseInt(str)
  return isNaN(num) ? {} : { beds: num }
}

/**
 * Fetch IDX listings from the server proxy.
 * @param {Object} [opts]
 * @param {string}  [opts.city]         Filter by city name
 * @param {string}  [opts.propertyType] UI type e.g. 'Single Family'
 * @param {string}  [opts.priceRange]   UI range e.g. '$3M – $7M'
 * @param {string}  [opts.beds]         UI beds e.g. '3+'
 * @param {boolean} [opts.leaseOnly]    Lease-only listings
 * @param {number}  [opts.top=12]       Results per page
 * @param {number}  [opts.skip=0]       Pagination offset
 * @returns {Promise<{ properties: Array, total: number }>}
 */
export async function fetchListings({
  city,
  propertyType,
  priceRange,
  beds,
  leaseOnly = false,
  top = 12,
  skip = 0,
} = {}) {
  const params = new URLSearchParams()
  if (city && city !== 'All') params.set('city', city)
  if (propertyType && propertyType !== 'All Types') params.set('propertyType', propertyType)
  if (leaseOnly) params.set('leaseOnly', 'true')

  const { minPrice, maxPrice } = parsePriceRange(priceRange)
  if (minPrice) params.set('minPrice', String(minPrice))
  if (maxPrice) params.set('maxPrice', String(maxPrice))

  const { beds: minBeds } = parseBeds(beds)
  if (minBeds) params.set('beds', String(minBeds))

  params.set('top', String(top))
  if (skip) params.set('skip', String(skip))

  const res = await fetch(`${IDX_ENDPOINT}?${params.toString()}`)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return res.json()
}
