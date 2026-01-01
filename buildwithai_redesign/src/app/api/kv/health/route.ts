import { NextResponse } from "next/server"
import { kvGetRdap, kvSetRdap } from '@/lib/kv'

export async function GET() {
  try {
    const testKey = 'kv-health-test'
    await kvSetRdap(testKey, { ok: true })
    const result = await kvGetRdap(testKey)

    return NextResponse.json({
      success: true,
      kv: result ? 'connected' : 'no-read',
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? 'KV error' }, { status: 500 })
  }
}
