import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || body.name || 'example.com'
  // simple test-mode response
  const result = { domain, available: false, message: 'registered (test mode)' }
  return NextResponse.json({ success: true, ...result })
}
