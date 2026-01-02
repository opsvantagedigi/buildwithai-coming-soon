import { describe, it, expect } from 'vitest'
import openprovider from '@/lib/openprovider'

describe('openprovider client (mock)', () => {
  it('returns null when disabled', async () => {
    const prev = process.env.OPENPROVIDER_ENABLED
    delete process.env.OPENPROVIDER_ENABLED
    const res = await openprovider.getPricing()
    expect(res).toBeNull()
    process.env.OPENPROVIDER_ENABLED = prev
  })
})
