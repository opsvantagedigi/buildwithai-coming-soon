import { NextResponse } from 'next/server'
import { fetchRdap } from '@/lib/rdap'

const POPULAR_DOMAINS = [
  'example.com',
  'google.com',
  'openai.com',
  'opsvantagedigital.online',
  'buildwithai.ai',
  'microsoft.com',
]

export async function GET() {
  const results: any[] = []
  for (const domain of POPULAR_DOMAINS) {
    try {
      await fetchRdap(domain)
      results.push({ domain, ok: true })
    } catch (err: any) {
      results.push({ domain, ok: false, error: String(err?.message || err) })
    }
  }

  return NextResponse.json({ success: true, warmed: results })
}
