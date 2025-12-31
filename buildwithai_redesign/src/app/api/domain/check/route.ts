import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || body.name || 'example.com'
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const res = await openprovider.checkDomain(domain)
      if (res) return NextResponse.json({ success: true, provider: 'openprovider', res })
    } catch (e) {
      console.error('OpenProvider check error', e)
    }
  }
  const result = { domain, available: false, message: 'registered (test mode)' }
  return NextResponse.json({ success: true, ...result })
}
