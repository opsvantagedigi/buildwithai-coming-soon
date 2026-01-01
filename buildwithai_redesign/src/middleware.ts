import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  if (pathname.startsWith('/admin')) {
    const provided = searchParams.get('token') || req.headers.get('x-admin-token')
    const expected = process.env.ADMIN_TOKEN
    if (!expected) {
      // No admin token configured — block access to be safe
      return NextResponse.rewrite(new URL('/', req.url))
    }
    if (!provided || provided !== expected) {
      return NextResponse.rewrite(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
