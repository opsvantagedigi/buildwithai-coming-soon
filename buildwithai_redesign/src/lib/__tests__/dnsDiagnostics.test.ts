import { analyzeDns } from '../dnsDiagnostics'

test('analyzeDns handles nameservers and dnssec', () => {
  const rdap = { nameservers: ['ns1.example.com'], dnssec: false }
  const res = analyzeDns(rdap)
  expect(Array.isArray(res)).toBe(true)
  // Should include a warning about single nameserver
  expect(res.some(r => /nameserver/i.test(r.message))).toBe(true)
})
