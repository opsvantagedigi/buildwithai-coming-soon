// Minimal OpenProvider client wrapper (placeholder).
// Configure via environment variables:
// OPENPROVIDER_ENABLED=true
// OPENPROVIDER_BASE_URL=https://api.openprovider.eu
// OPENPROVIDER_API_KEY=your_key
// OPENPROVIDER_API_SECRET=your_secret

// Lightweight OpenProvider client
// Note: This wrapper uses basic auth via API key/secret. Set OPENPROVIDER_ENABLED=true
// and add OPENPROVIDER_API_KEY/OPENPROVIDER_API_SECRET in env or Vercel project settings.

import { logInfo, logError } from './logger'

async function fetchJson(url: string, options: any = {}) {
  // small timeout wrapper with verbose, but safe logging
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), 15000)

  const method = (options.method || 'GET').toUpperCase()
  const headers = options.headers || {}
  const sanitizedHeaders: Record<string, string> = {}
  Object.keys(headers).forEach((k) => {
    if (k.toLowerCase() === 'authorization') sanitizedHeaders[k] = 'REDACTED'
    else sanitizedHeaders[k] = String((headers as any)[k])
  })

  try {
    logInfo('OpenProvider request', { method, url, headers: sanitizedHeaders, body: options.body ? '[REDACTED_BODY]' : undefined })

    const res = await fetch(url, { signal: controller.signal, ...options })

    const status = res.status
    let text = ''
    try {
      text = await res.text()
    } catch (e) {
      text = ''
    }

    // Try parse JSON for structured logging; fall back to raw text
    let parsed: any = null
    try {
      parsed = text ? JSON.parse(text) : null
    } catch (e) {
      parsed = text
    }

    logInfo('OpenProvider response', { url, status, body: typeof parsed === 'string' ? parsed.slice(0, 2000) : parsed })

    if (!res.ok) {
      logError('OpenProvider non-OK response', { url, status, body: typeof parsed === 'string' ? parsed.slice(0, 2000) : parsed })
      throw new Error(`OpenProvider error: ${status} ${text}`)
    }

    try {
      return parsed ?? {}
    } catch (e) {
      return {}
    }
  } catch (err: any) {
    logError('OpenProvider request failed', { url, method, message: err?.message })
    throw err
  } finally {
    clearTimeout(id)
  }
}

function getAuthHeaders() {
  const key = process.env.OPENPROVIDER_API_KEY
  const secret = process.env.OPENPROVIDER_API_SECRET
  const headers: Record<string,string> = { 'Content-Type': 'application/json' }
  if (key && secret) {
    // set Authorization but do not expose value in logs
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
