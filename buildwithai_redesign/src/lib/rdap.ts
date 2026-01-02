/**
 * RDAP helper with normalization to a canonical schema and a simple cache.
 * - Uses an in-memory Map cache by default (per-instance).
 * - If you add Vercel KV or Redis, wire it into `readFromStore`/`writeToStore`.
 */

type CacheEntry = { ts: number; data: any }

const TTL = 1000 * 60 * 5 // 5 minutes

const CACHE_KEY = '__BUILDWITHAI_RDAP_CACHE'

import { kvGetRdap, kvSetRdap } from '@/lib/kv'

// in-memory per-instance cache
const memoryCache = new Map<string, { value: any; expiresAt: number }>()
const MEMORY_TTL_MS = TTL

export async function fetchRdap(domain: string) {
  const key = domain.toLowerCase()
  const now = Date.now()

  // 1) in-memory
  const mem = memoryCache.get(key)
  if (mem && mem.expiresAt > now) return mem.value

  // 2) Vercel KV
  try {
    const kvVal = await kvGetRdap(key)
    if (kvVal) {
      memoryCache.set(key, { value: kvVal, expiresAt: now + MEMORY_TTL_MS })
      return kvVal
    }
  } catch (e) {
    // ignore KV errors
  }

  // 3) fetch RDAP upstream
  const url = `https://rdap.org/domain/${encodeURIComponent(domain)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`RDAP HTTP ${res.status}`)
  const data = await res.json()

  // store in both caches (best-effort)
  try {
    memoryCache.set(key, { value: data, expiresAt: now + MEMORY_TTL_MS })
    await kvSetRdap(key, data)
  } catch (e) {
    // ignore
  }

  return data
}

/**
 * Canonical RDAP schema:
 * {
 *  domain: string
 *  registered: boolean
 *  created?: string
 *  updated?: string
 *  expires?: string
 *  registrar?: string
 *  nameservers: string[]
 *  status: string[]
 *  dnssec: boolean
 *  contacts: { registrant?, admin?, tech? }
 * }
 */
export function normalizeToCanonical(rdap: any) {
  const out: any = {
    domain: rdap.ldhName || rdap.handle || null,
    registered: true,
    created: null,
    updated: null,
    expires: null,
    registrar: null,
    nameservers: [],
    status: [],
    dnssec: false,
    contacts: {},
    raw: rdap,
  }

  if (!rdap) return out

  // status
  if (Array.isArray(rdap.status)) out.status = rdap.status

  // dnssec
  if (rdap.secureDNS) out.dnssec = Boolean(rdap.secureDNS.delegationSigned)

  // nameservers
  if (Array.isArray(rdap.nameservers)) {
    out.nameservers = rdap.nameservers.map((n: any) => n.ldhName || n.handle || String(n))
  }

  // events -> created/updated/expires
  if (Array.isArray(rdap.events)) {
    for (const e of rdap.events) {
      const a = (e.eventAction || '').toLowerCase()
      if (a.includes('registration') && e.eventDate) out.created = e.eventDate
      if ((a.includes('last changed') || a.includes('update')) && e.eventDate) out.updated = e.eventDate
      if (a.includes('expiration') && e.eventDate) out.expires = e.eventDate
    }
  }

  // registrar
  if (Array.isArray(rdap.entities)) {
    const registrar = rdap.entities.find((en: any) => (en.roles || []).includes('registrar'))
    if (registrar) {
      out.registrar = registrar.vcardArray?.[1]?.find((r: any) => r[0] === 'fn')?.[3] || registrar.handle || null
    }

    // contacts
    const contactRoles = ['registrant', 'administrative', 'administrivia', 'admin', 'technical', 'tech']
    for (const en of rdap.entities) {
      const roles: string[] = en.roles || []
      if (roles.includes('registrant')) {
        out.contacts.registrant = extractContact(en)
      }
      if (roles.includes('administrative') || roles.includes('admin')) {
        out.contacts.admin = extractContact(en)
      }
      if (roles.includes('technical') || roles.includes('tech')) {
        out.contacts.tech = extractContact(en)
      }
    }
  }

  // registered detection: if status includes 'available' or rdap.notices indicates not found
  if (Array.isArray(rdap.status) && rdap.status.includes('active') === false) {
    // leave as-is; many RDAP responses don't use 'available' consistently
  }
  // Heuristic: if rdap.ldhName exists and is not an empty string, treat as registered
  out.registered = Boolean(rdap.ldhName)

  return out
}

function extractContact(entity: any) {
  const c: any = {}
  if (entity.vcardArray && Array.isArray(entity.vcardArray[1])) {
    for (const item of entity.vcardArray[1]) {
      const key = item[0]
      const val = item[3]
      if (!key || !val) continue
      if (key === 'fn') c.name = val
      if (key === 'email') c.email = val
      if (key === 'tel') c.phone = val
      if (key === 'adr') c.address = Array.isArray(val) ? val.join(' ') : val
    }
  }
  // fallback to handle
  if (!c.name && entity.handle) c.name = entity.handle
  return c
}

export default { fetchRdap, normalizeToCanonical }
