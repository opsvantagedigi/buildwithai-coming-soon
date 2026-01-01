// @ts-nocheck
;(async function main(){
  try{
    if (process.env.VERCEL_ENV !== 'production') {
      console.log('[KV CHECK] Non-production environment; skipping strict KV check.')
      process.exit(0)
    }

    const url = process.env.KV_HEALTH_URL ?? `${process.env.DEPLOYMENT_URL ?? ''}/api/kv/health`
    if (!url) {
      console.warn('[KV CHECK] No KV_HEALTH_URL or DEPLOYMENT_URL set; skipping KV connectivity check.')
      process.exit(0)
    }

    console.log(`[KV CHECK] Checking KV health at: ${url}`)
    const res = await fetch(url, { method: 'GET' })
    const data = await res.json()
    if (!res.ok || !data?.success) {
      console.error('[KV CHECK] KV health check failed.', res.status, data)
      process.exit(1)
    }
    console.log('[KV CHECK] KV is reachable and healthy:', data)
    process.exit(0)
  }catch(err){
    console.error('[KV CHECK] Error calling KV health endpoint:', err?.message || err)
    process.exit(1)
  }
})()
