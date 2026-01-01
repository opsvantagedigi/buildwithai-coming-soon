import { scoreRegistrar } from '../registrarReputation'

test('scoreRegistrar matches known registrar', () => {
  const res = scoreRegistrar('Namecheap, Inc')
  expect(res.score).toBe(80)
  expect(res.label).toMatch(/Trusted/i)
})
