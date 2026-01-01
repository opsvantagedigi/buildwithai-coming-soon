import { NextResponse } from 'next/server'
import { kvSetRdap } from '@/lib/kv'
import rdap from '@/lib/rdap'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const domains: string[] = Array.isArray(body?.domains) ? body.domains : []
    if (!domains.length) return NextResponse.json({ success: false, error: 'no_domains' }, { status: 400 })

    const results: any = {}
    for (const d of domains.slice(0, 50)) {
      try {
        const data = await rdap.fetchRdap(d)
        await kvSetRdap(d, data)
        results[d] = 'cached'
      } catch (e: any) {
        results[d] = `error:${String(e?.message||e)}`
      }
    }
    return NextResponse.json({ success: true, results })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: String(e?.message || e) }, { status: 500 })
  }
}
