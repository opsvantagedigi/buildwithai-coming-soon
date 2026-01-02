import { describe, it, expect } from 'vitest'
import validation from '@/lib/validation'

describe('validation schemas', () => {
  it('domain check fails on empty', () => {
    const result = validation.DomainCheckSchema.safeParse({ domain: '' })
    expect(result.success).toBe(false)
  })

  it('register schema requires domain and valid email when contact provided', () => {
    const ok = validation.RegisterSchema.safeParse({ domain: 'example.com', contact: { name: 'A', email: 'a@b.com' } })
    expect(ok.success).toBe(true)
    const bad = validation.RegisterSchema.safeParse({ domain: '', contact: { name: 'A', email: 'not-an-email' } })
    expect(bad.success).toBe(false)
  })
})
