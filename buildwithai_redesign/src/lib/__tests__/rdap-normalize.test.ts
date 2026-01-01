import { describe, it, expect } from 'vitest'
import rdapExample from './fixtures/rdap-example-com.json'
import { normalizeToCanonical } from '@/lib/rdap'

describe('normalizeToCanonical', () => {
  it('maps basic fields for example.com', () => {
    const result = normalizeToCanonical(rdapExample as any)
    expect(result.domain).toBe('EXAMPLE.COM')
    expect(result.registered).toBe(true)
    expect(result.registrar).toBeDefined()
    expect(Array.isArray(result.nameservers)).toBe(true)
    expect(result.status.length).toBeGreaterThan(0)
  })

  it('includes raw payload', () => {
    const result = normalizeToCanonical(rdapExample as any)
    expect(result.raw).toBeDefined()
  })

  it('handles missing contacts gracefully', () => {
    const modified = { ...rdapExample, entities: [] }
    const result = normalizeToCanonical(modified as any)
    expect(result.contacts.registrant).toBeUndefined()
  })
})
