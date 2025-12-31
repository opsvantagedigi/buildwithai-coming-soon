import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'
import validation from '@/lib/validation'
import logger from '@/lib/logger'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parse = validation.WhoisSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ success: false, error: 'invalid_payload', details: parse.error.format() }, { status: 400 })
  }
  const domain = parse.data.domain
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const res = await openprovider.whoisDomain(domain)
      if (res) return NextResponse.json({ success: true, provider: 'openprovider', res })
    } catch (e) {
      logger.logError('OpenProvider whois error', e)
      return NextResponse.json({ success: false, error: 'provider_error' }, { status: 502 })
    }
  }
  const whois = { domain, registered: false, expiry: null, privacy: false, raw: '' }
  return NextResponse.json({ success: true, whois })
}
