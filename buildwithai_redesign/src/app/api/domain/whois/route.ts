import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || 'example.com'
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const res = await openprovider.whoisDomain(domain)
      if (res) return NextResponse.json({ success: true, provider: 'openprovider', res })
    } catch (e) {
      console.error('OpenProvider whois error', e)
    }
  }
  const whois = { domain, registered: false, expiry: null, privacy: false, raw: '' }
  return NextResponse.json({ success: true, whois })
}
