"use client"
import React, { useState } from 'react'

export default function DomainsPage() {
  const [domain, setDomain] = useState('example.com')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/domain/info', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ domain }) })
      const data = await res.json()
      if (!res.ok) setError(data?.error || 'Unknown error')
      setResult(data)
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl mb-4">Domain Info (RDAP + Pricing + Availability)</h1>
      <form onSubmit={lookup} className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Looking...' : 'Lookup'}</button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {result && (
        <div className="space-y-4">
          <section className="p-4 border rounded">
            <h2 className="font-bold">Domain</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-mono">{result?.rdap?.domain || '—'}</div>
                <div className="text-sm text-gray-400">Registrar: {result?.rdap?.registrar || '—'}</div>
              </div>
              <div className="text-right">
                {result?.rdap?.registered ? (
                  <span className="inline-block rounded bg-red-100 px-3 py-1 text-sm text-red-700">Registered</span>
                ) : (
                  <span className="inline-block rounded bg-green-100 px-3 py-1 text-sm text-green-700">Available</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div><strong>Created</strong></div><div>{result?.rdap?.created || '—'}</div>
              <div><strong>Updated</strong></div><div>{result?.rdap?.updated || '—'}</div>
              <div><strong>Expires</strong></div><div>{result?.rdap?.expires || '—'}</div>
              <div><strong>DNSSEC</strong></div><div>{result?.rdap?.dnssec ? 'Enabled' : 'Not enabled'}</div>
              <div><strong>Nameservers</strong></div><div>{(result?.rdap?.nameservers || []).join(', ') || '—'}</div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Domain Health</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-3xl font-bold">{result?.health?.score ?? '—'}</div>
                <div className="text-sm text-gray-600">{result?.health?.score ? 'Higher is better' : 'No score'}</div>
              </div>

              {result?.health?.explanations && (
                <div className="mt-3">
                  <h4 className="font-medium">Details</h4>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {result.health.explanations.map((line: string, idx: number) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3">
                <p className="text-sm mt-1">
                  <strong>Registrar reputation:</strong>{' '}
                  {result.health?.factors?.registrarReputation?.label ?? 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">{result.health?.factors?.registrarReputation?.notes}</p>
              </div>
            </div>
          </section>

          <section className="p-4 border rounded">
            <h2 className="font-bold">Pricing</h2>
            <pre className="whitespace-pre-wrap max-h-64 overflow-auto">{JSON.stringify(result?.pricing, null, 2)}</pre>
          </section>

          {result?.recommendations && result.recommendations.length > 0 && (
            <section className="p-4 border rounded bg-white">
              <h3 className="font-semibold mb-2">AI‑powered domain ideas</h3>
              <p className="text-xs text-gray-500 mb-3">These are suggested variations based on your domain. Availability and pricing are estimates.</p>
              <ul className="space-y-2 text-sm">
                {result.recommendations.map((rec: any) => (
                  <li key={rec.domain} className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono">{rec.domain}</span>
                        {rec.availability === true && <span className="text-green-700 text-xs">Available</span>}
                        {rec.availability === false && <span className="text-red-700 text-xs">Taken</span>}
                        {rec.availability === null && <span className="text-gray-500 text-xs">Unknown</span>}
                      </div>
                      <div className="text-xs text-gray-600">{rec.reason}{rec.suggestedUse ? ` · ${rec.suggestedUse}` : null}</div>
                    </div>
                    <span className="text-xs text-gray-500">Similarity: {(rec.similarity * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="p-4 border rounded">
            <h2 className="font-bold">Availability</h2>
            <div>Available: {String(result?.availability?.available)}</div>
          </section>

          {result?.dnsDiagnostics && result.dnsDiagnostics.length > 0 && (
            <section className="p-4 border rounded bg-white">
              <h3 className="font-semibold mb-2">DNS diagnostics</h3>
              <ul className="space-y-1 text-sm">
                {result.dnsDiagnostics.map((item: any, idx: number) => (
                  <li key={idx} className={
                    item.level === 'critical' ? 'text-red-700' : item.level === 'warning' ? 'text-yellow-700' : 'text-gray-800'
                  }>
                    {item.message}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result?.seo && (
            <section className="p-4 border rounded bg-white">
              <h3 className="font-semibold mb-2">SEO‑oriented domain analysis</h3>
              <p className="text-sm mb-1">SEO domain score: <strong>{result.seo.score}</strong> ({result.seo.grade})</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {result.seo.explanations?.map((line: string, idx: number) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="p-4 border rounded">
            <h2 className="font-bold">Contacts</h2>
            <pre className="whitespace-pre-wrap max-h-64 overflow-auto">{JSON.stringify(result?.rdap?.contacts || {}, null, 2)}</pre>
          </section>
        </div>
      )}
    </main>
  )
}
