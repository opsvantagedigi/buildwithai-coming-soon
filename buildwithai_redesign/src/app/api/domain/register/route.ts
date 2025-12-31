import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || 'example.com'
  const nameservers = body.nameservers || []
  const contact = body.contact || null
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const res = await openprovider.registerDomain(domain, contact, nameservers)
      if (res) return NextResponse.json({ success: true, provider: 'openprovider', res })
    } catch (e) {
      console.error('OpenProvider register error', e)
    }
  }
  return NextResponse.json({ success: true, message: 'Domain registered (test mode)', domain, nameservers })
}
