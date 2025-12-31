import { NextResponse } from 'next/server'

export async function GET() {
  const pricing = [
    { tld: '.com', price: 12.99 },
    { tld: '.net', price: 14.99 },
    { tld: '.digital', price: 9.99 },
    { tld: '.co.nz', price: 22 },
  ]
  return NextResponse.json(pricing)
}
