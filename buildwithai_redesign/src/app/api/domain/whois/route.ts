import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || 'example.com'
  const whois = { domain, registered: false, expiry: null, privacy: false, raw: '' }
  return NextResponse.json({ success: true, whois })
}
