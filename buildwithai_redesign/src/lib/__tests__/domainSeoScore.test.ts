import { scoreDomainSeo } from '../domainSeoScore'

test('scoreDomainSeo for short brand', () => {
  const res = scoreDomainSeo('shortname.com')
  expect(res).toHaveProperty('score')
  expect(res.explanations.length).toBeGreaterThan(0)
})
