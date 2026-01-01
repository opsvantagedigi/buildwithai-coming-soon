import { NextResponse } from 'next/server'
import validation from '@/lib/validation'
import rdap from '@/lib/rdap'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parse = validation.DomainCheckSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ success: false, error: 'invalid_payload', details: parse.error.format() }, { status: 400 })
  }
  const domain = parse.data.domain

  try {
    const rdapRaw = await rdap.fetchRdap(domain)
    const rdapNorm = rdap.normalizeToCanonical(rdapRaw)
    const available = !rdapNorm.registered
    return NextResponse.json({ success: true, domain, available, rdap: rdapNorm })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'rdap_error', message: String(e?.message || e) }, { status: 502 })
  }
}
