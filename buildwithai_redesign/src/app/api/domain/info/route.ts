import { NextResponse } from 'next/server'
import validation from '@/lib/validation'
import rdap from '@/lib/rdap'
import { getPricingData } from '@/app/api/domain/pricing/route'
import openprovider from '@/lib/openprovider'
import computeDomainHealth from '@/lib/domainHealth'
import { generateDomainRecommendations, enrichRecommendationsWithAvailability } from '@/lib/domainRecommend'
import { analyzeDns } from '@/lib/dnsDiagnostics'
import { scoreDomainSeo } from '@/lib/domainSeoScore'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parse = validation.DomainCheckSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ success: false, error: 'invalid_payload', details: parse.error.format() }, { status: 400 })
  }
  const domain = parse.data.domain

  const tasks: any = {}
  tasks.rdap = rdap.fetchRdap(domain).then((d: any) => rdap.normalizeToCanonical(d)).catch((e: any) => ({ error: 'rdap_error', message: String(e?.message || e) }))
  tasks.pricing = getPricingData().catch((e: any) => ({ error: 'pricing_error', message: String(e?.message || e) }))

  // availability uses RDAP (no OpenProvider dependency)
  tasks.availability = tasks.rdap.then((r: any) => {
    if (r && r.registered !== undefined) return { available: !r.registered }
    return { available: null }
  }).catch(() => ({ available: null }))

  const [rdapRes, pricingRes, availabilityRes] = await Promise.all([tasks.rdap, tasks.pricing, tasks.availability])
  // ensure pricing has a consistent shape
  let pricingFinal: any = pricingRes
  function buildFallbackPricing(domain: string) {
    return {
      currency: 'USD',
      estimated: true,
      notes: 'Fallback pricing estimate based on TLD; final price shown at checkout.',
      items: [{ type: 'register', price: 15, periodYears: 1 }],
    }
  }
  if (!pricingFinal || (Array.isArray(pricingFinal) && pricingFinal.length === 0)) {
    pricingFinal = buildFallbackPricing(domain)
  }

  const health = rdapRes && !(rdapRes as any).error ? computeDomainHealth(rdapRes) : { score: null }
  const recommendations = await generateDomainRecommendations(domain)
  const recommendationsEnriched = await enrichRecommendationsWithAvailability(recommendations)
  const dnsDiagnostics = rdapRes && !(rdapRes as any).error ? analyzeDns(rdapRes) : []
  const seo = scoreDomainSeo(domain)

  const res = NextResponse.json({ success: true, domain, rdap: rdapRes, pricing: pricingFinal, availability: availabilityRes, health, recommendations: recommendationsEnriched, dnsDiagnostics, seo })
  // set short cache header for clients
  res.headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
  return res
}
