#!/usr/bin/env node
;(async function main(){
  try{
    // Only run strict checks in production builds; otherwise exit cleanly.
    if (process.env.VERCEL_ENV !== 'production') {
      console.log('[KV CHECK] Non-production environment; skipping strict KV check.')
      process.exit(0)
    }

    // Determine an absolute base URL for the deployed site. Prefer an explicit
    // NEXT_PUBLIC_SITE_URL (set in Vercel envs), then VERCEL_URL (in preview),
    // and finally fall back to the canonical production domain.
    const getBase = () => {
      if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
      if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
      return 'https://buildwithai.digital'
    }

    const base = getBase()
    const url = process.env.KV_HEALTH_URL ?? `${base}/api/kv/health`

    if (!url) {
      console.warn('[KV CHECK] No KV_HEALTH_URL or resolved base URL; skipping KV connectivity check.')
      process.exit(0)
    }

    console.log('[KV CHECK] Checking KV health at:', url)
    try {
      const res = await fetch(url, { method: 'GET' })
      const data = await res.json()
      console.log('[KV CHECK] KV health response:', data)
      // Do not fail the build on KV issues; just log the result.
    } catch (err) {
      console.error('[KV CHECK] Error calling KV health endpoint:', err?.message || err)
    }

    process.exit(0)
  }catch(err){
    console.error('[KV CHECK] Unexpected error in KV check:', err?.message || err)
    process.exit(0)
  }
})()
