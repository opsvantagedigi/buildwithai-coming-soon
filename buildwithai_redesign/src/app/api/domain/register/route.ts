import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const domain = body.domain || 'example.com'
  const nameservers = body.nameservers || []
  return NextResponse.json({ success: true, message: 'Domain registered (test mode)', domain, nameservers })
}
