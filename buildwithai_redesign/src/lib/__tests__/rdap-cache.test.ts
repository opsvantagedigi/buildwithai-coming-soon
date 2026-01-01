import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as rdapModule from '@/lib/rdap'
import * as kv from '@/lib/kv'

describe('RDAP caching behavior', () => {
  beforeEach(() => {
    // clear in-memory cache inside rdap module
    // (memoryCache is internal; we clear by reimporting a fresh module in real tests,
    // but for simplicity we spy on kv and fetch)
    vi.resetModules()
  })

  it('prefers in-memory cache then KV then upstream', async () => {
    // mock kv get/set
    const kvGet = vi.spyOn(kv, 'kvGetRdap').mockResolvedValue(null)
    const kvSet = vi.spyOn(kv, 'kvSetRdap').mockResolvedValue(undefined)

    // mock fetch upstream
    const fakeRdap = { ldhName: 'TEST.COM' }
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => fakeRdap }) as any

    const data1 = await rdapModule.fetchRdap('test.com')
    expect(data1).toEqual(fakeRdap)
    expect(kvGet).toHaveBeenCalled()
    expect(kvSet).toHaveBeenCalled()

    // Now simulate KV hit
    kvGet.mockResolvedValueOnce(fakeRdap);
    // ensure fetch not called this time
    ;(globalThis.fetch as any).mockClear()
    const data2 = await rdapModule.fetchRdap('test.com')
    expect(data2).toEqual(fakeRdap)
    // fetch should not be called on KV hit
    expect((globalThis.fetch as any).mock.calls.length).toBe(0)
  })
})
