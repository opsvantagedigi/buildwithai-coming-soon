import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || 'example.com'
  const records = body.records || []
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const res = await openprovider.provisionDNS(domain, records)
      if (res) return NextResponse.json({ success: true, provider: 'openprovider', res })
    } catch (e) {
      console.error('OpenProvider dns error', e)
    }
  }
  return NextResponse.json({ success: true, message: 'DNS provisioned (test mode)', domain, records })
}
