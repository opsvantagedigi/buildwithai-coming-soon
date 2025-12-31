import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || 'example.com'
  const records = body.records || []
  return NextResponse.json({ success: true, message: 'DNS provisioned (test mode)', domain, records })
}
