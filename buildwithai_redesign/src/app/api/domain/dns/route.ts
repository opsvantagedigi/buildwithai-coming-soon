import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'
import validation from '@/lib/validation'
import logger from '@/lib/logger'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parse = validation.DnsSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ success: false, error: 'invalid_payload', details: parse.error.format() }, { status: 400 })
  }
  const { domain, records } = parse.data
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const res = await openprovider.provisionDNS(domain, records)
      if (res) return NextResponse.json({ success: true, provider: 'openprovider', res })
    } catch (e) {
      logger.logError('OpenProvider dns error', e)
      return NextResponse.json({ success: false, error: 'provider_error' }, { status: 502 })
    }
  }
  return NextResponse.json({ success: true, message: 'DNS provisioned (test mode)', domain, records })
}
