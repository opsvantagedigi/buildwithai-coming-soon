import computeDomainHealth from '../domainHealth'

test('computeDomainHealth returns explanations and score', () => {
  const rdap = {
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 4).toISOString(), // 4 years
    dnssec: true,
    status: ['clientTransferProhibited'],
    nameservers: ['ns1.example.com', 'ns2.example.com'],
    registrar: 'Namecheap'
  }
  const res = computeDomainHealth(rdap)
  expect(res).toHaveProperty('score')
  expect(res).toHaveProperty('explanations')
  expect(Array.isArray(res.explanations)).toBe(true)
  expect(res.explanations.length).toBeGreaterThan(0)
})
