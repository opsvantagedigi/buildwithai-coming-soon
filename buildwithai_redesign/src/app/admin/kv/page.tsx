"use client"

import { useEffect, useState } from 'react'

type KvHealth = { success: boolean; kv: string; ts?: number; error?: string }
type WarmResult = { domain: string; ok: boolean; error?: string }

export default function KvAdminPage() {
  const [health, setHealth] = useState<KvHealth | null>(null)
  const [loadingHealth, setLoadingHealth] = useState(false)

  const [domainsInput, setDomainsInput] = useState('example.com, openai.com')
  const [warmResults, setWarmResults] = useState<WarmResult[] | null>(null)
  const [warming, setWarming] = useState(false)

  useEffect(() => { refreshHealth() }, [])

  async function refreshHealth() {
    setLoadingHealth(true)
    try {
      const res = await fetch('/api/kv/health')
      const data = await res.json()
      setHealth(data)
    } catch (err) {
      setHealth({ success: false, kv: 'error', error: 'Failed to load health' })
    } finally { setLoadingHealth(false) }
  }

  async function triggerWarm() {
    setWarming(true)
    setWarmResults(null)
    try {
      const domains = domainsInput.split(',').map(d => d.trim()).filter(Boolean)
      const res = await fetch('/api/kv/warm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domains }) })
      const data = await res.json()
      setWarmResults(Object.keys(data.results || {}).map(k => ({ domain: k, ok: data.results[k] === 'cached', error: typeof data.results[k] === 'string' && data.results[k].startsWith('error:') ? data.results[k] : undefined })))
    } catch (err) {
      setWarmResults([{ domain: 'unknown', ok: false, error: 'Warm request failed' }])
    } finally { setWarming(false) }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">KV & RDAP Admin</h1>

      <div className="text-sm text-gray-600">This admin UI is protected — include <code>?token=YOUR_TOKEN</code> in the URL or set an <code>x-admin-token</code> header. Set <code>ADMIN_DASHBOARD_TOKEN</code> in your deployment environment.</div>

      <section className="rounded-lg border p-4 bg-white space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">KV Health</h2>
          <button onClick={refreshHealth} disabled={loadingHealth} className="text-sm px-3 py-1 rounded bg-gray-900 text-white disabled:opacity-50">{loadingHealth ? 'Checking...' : 'Refresh'}</button>
        </div>

        {health && (
          <div className="text-sm">
            <p><span className="font-medium">Status:</span> {health.success ? 'Healthy' : 'Unhealthy'} ({health.kv})</p>
            {health.ts && <p><span className="font-medium">Last check:</span> {new Date(health.ts).toLocaleString()}</p>}
            {health.error && <p className="text-red-600 text-xs mt-1">Error: {health.error}</p>}
          </div>
        )}

        {!health && !loadingHealth && <p className="text-sm text-gray-600">No health data loaded yet.</p>}
      </section>

      <section className="rounded-lg border p-4 bg-white space-y-3">
        <h2 className="font-semibold">Warm KV with domains</h2>
        <p className="text-xs text-gray-600">Enter a comma‑separated list of domains to pre‑fetch RDAP + KV.</p>
        <textarea className="w-full border rounded p-2 text-sm" rows={3} value={domainsInput} onChange={(e) => setDomainsInput(e.target.value)} />
        <button onClick={triggerWarm} disabled={warming} className="text-sm px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50">{warming ? 'Warming...' : 'Run warm job'}</button>

        {warmResults && (
          <div className="mt-3 text-sm">
            <h3 className="font-medium mb-1">Results</h3>
            <ul className="space-y-1">
              {warmResults.map((r, idx) => (
                <li key={idx}><span className="font-mono">{r.domain}</span> {r.ok ? <span className="text-green-700 text-xs">OK</span> : <span className="text-red-700 text-xs">FAILED {r.error ? `- ${r.error}` : ''}</span>}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}
