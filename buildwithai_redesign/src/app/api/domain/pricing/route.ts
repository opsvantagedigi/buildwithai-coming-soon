import { NextResponse } from 'next/server'
import openprovider from '@/lib/openprovider'

export async function getPricingData() {
  if (process.env.OPENPROVIDER_ENABLED) {
    try {
      const data = await openprovider.getPricing()
      if (data) return data
    } catch (e) {
      console.error('OpenProvider pricing error', e)
    }
  }
  return [
    { tld: '.com', price: 12.99 },
    { tld: '.net', price: 14.99 },
    { tld: '.digital', price: 9.99 },
    { tld: '.co.nz', price: 22 },
  ]
}

export async function GET() {
  const pricing = await getPricingData()
  return NextResponse.json(pricing)
}
