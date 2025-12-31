// Minimal OpenProvider client wrapper (placeholder).
// Configure via environment variables:
// OPENPROVIDER_ENABLED=true
// OPENPROVIDER_BASE_URL=https://api.openprovider.eu
// OPENPROVIDER_API_KEY=your_key
// OPENPROVIDER_API_SECRET=your_secret

// Lightweight OpenProvider client
// Note: This wrapper uses basic auth via API key/secret. Set OPENPROVIDER_ENABLED=true
// and add OPENPROVIDER_API_KEY/OPENPROVIDER_API_SECRET in env or Vercel project settings.

async function fetchJson(url: string, options: any = {}) {
  // small timeout wrapper
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(url, { signal: controller.signal, ...options })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`OpenProvider error: ${res.status} ${txt}`)
    }
    return res.json().catch(() => ({}))
  } finally {
    clearTimeout(id)
  }
}

function getAuthHeaders() {
  const key = process.env.OPENPROVIDER_API_KEY
  const secret = process.env.OPENPROVIDER_API_SECRET
  const headers: Record<string,string> = { 'Content-Type': 'application/json' }
  if (key && secret) {
    headers['Authorization'] = `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`
  }
  return headers
}

export async function getPricing() {
  if (!process.env.OPENPROVIDER_ENABLED) return null
  const base = process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu'
  // The exact endpoint may vary depending on OpenProvider API version; adjust if needed.
  const url = `${base}/v1/domains/prices`
  return fetchJson(url, { headers: getAuthHeaders() })
}

export async function checkDomain(domain: string) {
  if (!process.env.OPENPROVIDER_ENABLED) return null
  const base = process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu'
  const url = `${base}/v1/domains/check?domain=${encodeURIComponent(domain)}`
  return fetchJson(url, { headers: getAuthHeaders() })
}

export async function whoisDomain(domain: string) {
  if (!process.env.OPENPROVIDER_ENABLED) return null
  const base = process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu'
  const url = `${base}/v1/domains/whois?domain=${encodeURIComponent(domain)}`
  return fetchJson(url, { headers: getAuthHeaders() })
}

export async function registerDomain(domain: string, contact: any, nameservers: string[]) {
  if (!process.env.OPENPROVIDER_ENABLED) return null
  const base = process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu'
  const url = `${base}/v1/domains/register`
  return fetchJson(url, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ domain, contact, nameservers }) })
}

export async function provisionDNS(domain: string, records: any[]) {
  if (!process.env.OPENPROVIDER_ENABLED) return null
  const base = process.env.OPENPROVIDER_BASE_URL || 'https://api.openprovider.eu'
  const url = `${base}/v1/domains/${encodeURIComponent(domain)}/dns/records`
  return fetchJson(url, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ records }) })
}

export default { getPricing, checkDomain, whoisDomain, registerDomain, provisionDNS }
