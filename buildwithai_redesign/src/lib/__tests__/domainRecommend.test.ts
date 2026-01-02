import { generateDomainRecommendations } from '../domainRecommend'

test('generate recommendations for example.com', async () => {
  const recs = await generateDomainRecommendations('example.com')
  expect(Array.isArray(recs)).toBe(true)
  expect(recs.length).toBeGreaterThan(0)
  const hasGet = recs.some(r => r.domain === 'getexample.com')
  expect(hasGet).toBe(true)
  // price should be numeric or null
  expect(['number', 'object']).toContain(typeof recs[0].price)
})
