import { describe, it, expect } from 'vitest'
import { getVersion } from '@/app/api/version/route'
import { getPricingData } from '@/app/api/domain/pricing/route'

describe('api helpers', () => {
  it('getVersion returns version object', () => {
    const v = getVersion()
    expect(v).toHaveProperty('version')
    expect(typeof v.timestamp).toBe('number')
  })

  it('getPricingData returns array', async () => {
    const p = await getPricingData()
    expect(Array.isArray(p)).toBe(true)
    expect(p.length).toBeGreaterThan(0)
  })
})
