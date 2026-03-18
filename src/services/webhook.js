// ─── Radius Office API integration ───────────────────────────────────────────
//
// Requests go to /api/radius-import — a local proxy in dev (vite.config.js)
// and a Netlify Function in production (netlify/functions/radius-import.mjs).
// The secure-id is injected server-side in both cases, so it never appears
// in the browser bundle or DevTools network tab.

// Relative path works in both dev (Vite proxy) and prod (Netlify function)
const RADIUS_ENDPOINT = '/api/radius-import'

// ─── Lead identity ────────────────────────────────────────────────────────────
// Persist visitor identity across touchpoints (inquiry → favorite → search).

const LEAD_KEY = 'hlcyn_lead'

export function getLeadIdentity() {
  try {
    return JSON.parse(localStorage.getItem(LEAD_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function setLeadIdentity(fields = {}) {
  const merged = { ...getLeadIdentity(), ...fields }
  localStorage.setItem(LEAD_KEY, JSON.stringify(merged))
  return merged
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CLIENT_TYPE_MAP = {
  Buying: 'buyer',
  Selling: 'seller',
  Investment: 'buyer',
  Leasing: 'tenant',
  'General Inquiry': 'buyer',
}

/** Strip to exactly 10 digits, dropping a leading country code if present. */
function sanitizePhone(raw) {
  if (!raw) return null
  const digits = String(raw).replace(/\D/g, '')
  const cleaned = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits
  return cleaned.length === 10 ? cleaned : null
}

/**
 * Parse a human-readable budget string like "$5M – $10M" or "$750K"
 * into { min, max } integers.
 */
function parseBudget(str) {
  if (!str) return { min: null, max: null }
  const toNum = (s) => {
    if (!s) return null
    const n = parseFloat(s.replace(/[$,]/g, ''))
    if (/[Mm]/.test(s)) return Math.round(n * 1_000_000)
    if (/[Kk]/.test(s)) return Math.round(n * 1_000)
    return Math.round(n)
  }
  const parts = str.split(/[-–—]/).map((p) => p.trim())
  return { min: toNum(parts[0]), max: toNum(parts[1]) ?? toNum(parts[0]) }
}

// ─── Core POST ────────────────────────────────────────────────────────────────

async function postToRadius(payload, retries = 2) {
  const body = JSON.stringify(payload)

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(RADIUS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })

      const data = await res.json().catch(() => ({}))

      if (data?.error) {
        console.warn('[radius] API error:', data.error)
        return // don't retry API validation errors
      }

      if (res.ok) return data
      if (res.status < 500) return // 4xx — won't be fixed by retrying
    } catch (err) {
      if (attempt === retries) {
        console.warn('[radius] Request failed after retries:', err)
        return
      }
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
    }
  }
}

// ─── Public event functions ───────────────────────────────────────────────────

/**
 * Contact / inquiry form submission.
 * Maps form fields → Radius client + req payload and saves lead identity.
 */
export async function sendInquiryLead({ name, email, phone, type, budget, message }) {
  setLeadIdentity({ name, email, phone })

  const { min: minBudget, max: maxBudget } = parseBudget(budget)
  const clientType = CLIENT_TYPE_MAP[type] ?? 'buyer'
  const phone10 = sanitizePhone(phone)

  const payload = {
    client: {
      name,
      type: clientType,
      status: 'New',
      emails: email,
      ...(phone10 && { phones: phone10 }),
      source: 'other_agency',
      tags: ['website', 'inquiry'],
      ...(message && { note: message }),
    },
    // Attach buyer requirements for buying/investment inquiries
    ...(clientType === 'buyer' && (minBudget || maxBudget) && {
      req: {
        state: 'California',
        ...(minBudget && { min_budget: minBudget }),
        ...(maxBudget && { max_budget: maxBudget }),
        area_unit: 'Sq.ft',
        country: 'United States',
      },
    }),
  }

  return postToRadius(payload)
}

/**
 * Footer newsletter signup.
 * Saves email to local identity. Does NOT post to Radius — Radius requires
 * name + email at minimum. When this visitor later submits the inquiry form,
 * the full record will be sent with their email pre-linked.
 */
export function sendNewsletterLead(email) {
  setLeadIdentity({ email })
  // No Radius call — insufficient fields (name required, error code 101)
}

/**
 * Property heart/save interaction.
 * Only fires if lead identity was previously captured (name + email required).
 * Maps saved property into buyer requirements so agent sees it in Radius.
 */
export function sendPropertyInterest(property) {
  const { name, email, phone } = getLeadIdentity()
  if (!name || !email) return // Radius requires both — skip silently

  const phone10 = sanitizePhone(phone)

  const payload = {
    client: {
      name,
      type: 'buyer',
      emails: email,
      ...(phone10 && { phones: phone10 }),
      source: 'other_agency',
      tags: ['website', 'saved-property'],
    },
    req: {
      city: property.city,
      state: 'California',
      // Bracket ±10% around list price as buyer requirement
      min_budget: Math.round(property.price * 0.9),
      max_budget: Math.round(property.price * 1.1),
      bedroom: property.beds,
      bathroom: property.baths,
      area_unit: 'Sq.ft',
      country: 'United States',
    },
  }

  return postToRadius(payload)
}
