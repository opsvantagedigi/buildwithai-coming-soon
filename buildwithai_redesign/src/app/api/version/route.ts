import { NextResponse } from 'next/server'

export function getVersion() {
  return { version: '0.1.0', timestamp: Date.now() }
}

export async function GET() {
  return NextResponse.json(getVersion())
}
