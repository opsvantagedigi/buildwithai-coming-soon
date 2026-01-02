import { NextResponse } from "next/server"
import { kvGetRdap, kvSetRdap } from '@/lib/kv'

export async function GET() {
  console.log(
    '[KV RUNTIME] RO token present:',
    !!process.env.KV_REST_API_READ_ONLY_TOKEN
  )
  console.log(
    '[KV RUNTIME] WRITE token present:',
    !!process.env.KV_REST_API_WRITE_TOKEN
  )
  console.log(
    '[KV RUNTIME] UPSTASH token present:',
    !!process.env.UPSTASH_REDIS_REST_TOKEN,
    'UPSTASH URL present:',
    !!process.env.UPSTASH_REDIS_REST_URL,
    'KV_REST_API_TOKEN present:',
    !!process.env.KV_REST_API_TOKEN
  )
  try {
    const testKey = 'kv-health-test'
    try {
      const setRes = await kvSetRdap(testKey, { ok: true })
      console.log('[KV RUNTIME] kvSetRdap: result type:', typeof setRes, 'value:', JSON.stringify(setRes))
    } catch (e: any) {
      console.log('[KV RUNTIME] kvSetRdap: error', e?.message ?? e)
    }

    let result: any = null
    try {
      result = await kvGetRdap(testKey)
      console.log('[KV RUNTIME] kvGetRdap: raw:', JSON.stringify(result), 'present:', !!result)
    } catch (e: any) {
      console.log('[KV RUNTIME] kvGetRdap: error', e?.message ?? e)
    }

    return NextResponse.json({
      success: true,
      kv: result ? 'connected' : 'no-read',
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? 'KV error' }, { status: 500 })
  }
}
