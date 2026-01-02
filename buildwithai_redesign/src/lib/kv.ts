// Thin Vercel KV adapter. If @vercel/kv is not installed or KV is not configured,
// these functions fail gracefully and return null / noop.
let kvClient: any = null
try {
  // If the project already has UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
  // or custom WRITE/READ env names set, map them to the names expected by
  // `@vercel/kv` at runtime so the package can pick them up without changing
  // Vercel project env names. Do NOT log values or expose secrets.
  if (!process.env.KV_REST_API_URL) {
    process.env.KV_REST_API_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  }
  if (!process.env.KV_REST_API_TOKEN) {
    process.env.KV_REST_API_TOKEN = process.env.KV_REST_API_WRITE_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN || process.env.KV_REST_API_TOKEN
  }

  // Construct the module name so static analyzers can't find the literal
  const moduleName = '@' + 'vercel' + '/kv'
  // Use eval to call require at runtime; this avoids bundlers resolving the import
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  // @ts-ignore
  const kv = eval('require')(moduleName)
  kvClient = kv.kv || kv
} catch (e) {
  // package not installed or not available in this environment; try an
  // Upstash REST fallback if UPSTASH_REDIS_REST_URL/TOKEN are available.
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (upstashUrl && upstashToken) {
    const base = upstashUrl.replace(/\/$/, '')
    kvClient = {
      async get(key: string) {
        try {
          const res = await fetch(`${base}/get/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${upstashToken}` },
          })
          if (!res.ok) return null
          const j = await res.json()
          return j.result ?? null
        } catch (_) {
          return null
        }
      },
      async set(key: string, value: any) {
        try {
          // Upstash expects simple JSON with `value` field for the set endpoint
          await fetch(`${base}/set/${encodeURIComponent(key)}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${upstashToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value: typeof value === 'string' ? value : JSON.stringify(value) }),
          })
          return true
        } catch (_) {
          return null
        }
      },
      async expire(key: string, ttl: number) {
        try {
          await fetch(`${base}/expire/${encodeURIComponent(key)}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${upstashToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ttl }),
          })
          return true
        } catch (_) {
          return null
        }
      },
    }
  } else {
    kvClient = null
  }
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
    const setResult = await kvClient.set(key, value)
    // If the client supports expiration, set TTL separately (best-effort)
    try {
      if (typeof kvClient.expire === 'function') await kvClient.expire(key, RDAP_TTL_SECONDS)
    } catch (_) {
      // ignore
    }
    return setResult
  } catch (e) {
    // fail silently
    return null
  }
}

export default { kvGetRdap, kvSetRdap }
