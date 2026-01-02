"use client"
import React, { useEffect, useState } from 'react'

type RDAPPanelProps = { domain?: string }

export default function RDAPPanel({ domain }: RDAPPanelProps){
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!domain) return
    setLoading(true)
    fetch(`/api/domain/info?domain=${encodeURIComponent(domain)}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [domain])

  if (loading) return <div className="rdap-panel">Loading RDAP...</div>
  if (!data) return <div className="rdap-panel empty">No RDAP data</div>

  return (
    <div className="rdap-panel">
      <div className="rdap-row">
        <span className="rdap-label">Registrar</span>
        <span className="rdap-value">{data.registrar || data.registrarName || '—'}</span>
      </div>

      <div className="rdap-row">
        <span className="rdap-label">Expiry</span>
        <span className="rdap-value">{data.expiry || data.expires || '—'}</span>
      </div>

      <div className="rdap-row">
        <span className="rdap-label">Status</span>
        <span className="rdap-value">{Array.isArray(data.status)?data.status.join(', '):data.status||'—'}</span>
      </div>

      <div className="rdap-row">
        <span className="rdap-label">Nameservers</span>
        <span className="rdap-value">{Array.isArray(data.nameservers)?data.nameservers.join(', '):data.nameservers||'—'}</span>
      </div>
    </div>
  )
}
