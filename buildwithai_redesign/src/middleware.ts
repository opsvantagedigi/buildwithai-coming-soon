import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const token = searchParams.get('token') || req.headers.get('x-admin-token')
  const expected = process.env.ADMIN_DASHBOARD_TOKEN

  if (!expected) {
    return new NextResponse('ADMIN_DASHBOARD_TOKEN is not configured on the server.', { status: 500 })
  }

  if (!token || token !== expected) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
