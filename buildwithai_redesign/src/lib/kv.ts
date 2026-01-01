// Thin Vercel KV adapter. If @vercel/kv is not installed or KV is not configured,
// these functions fail gracefully and return null / noop.
let kvClient: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const kv = require('@vercel/kv')
  kvClient = kv.kv || kv
} catch (e) {
  // package not installed or not available in this environment; fall back
  kvClient = null
}

const RDAP_TTL_SECONDS = 300

export async function kvGetRdap(domain: string) {
  if (!kvClient) return null
  try {
    const key = `rdap:${domain.toLowerCase()}`
    const value = await kvClient.get(key)
    return value ?? null
  } catch (e) {
    return null
  }
}

export async function kvSetRdap(domain: string, value: any) {
  if (!kvClient) return
  try {
    const key = `rdap:${domain.toLowerCase()}`
    // @vercel/kv supports expire via .set with options in newer versions; use simple set
    await kvClient.set(key, value)
    // If the client supports expiration, set TTL separately (best-effort)
    try {
      if (typeof kvClient.expire === 'function') await kvClient.expire(key, RDAP_TTL_SECONDS)
    } catch (_) {
      // ignore
    }
  } catch (e) {
    // fail silently
  }
}

export default { kvGetRdap, kvSetRdap }
