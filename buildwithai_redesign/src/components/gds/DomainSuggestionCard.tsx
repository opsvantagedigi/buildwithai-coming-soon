"use client"
import React, { useEffect, useState } from 'react'
import Tag from './Tag'

type Props = {
  domain: string
  onSelect?: (domain: string)=>void
}

export default function DomainSuggestionCard({ domain, onSelect }: Props){
  const [status, setStatus] = useState<string>('checking')
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    if (!domain) return

    fetch(`/api/domain/check?domain=${encodeURIComponent(domain)}`)
      .then((r) => r.json())
      .then((d) => setStatus(d?.available ? 'available' : 'taken'))
      .catch(() => setStatus('unknown'))

    fetch(`/api/domain/pricing?domain=${encodeURIComponent(domain)}`)
      .then((r) => r.json())
      .then((d) => setPrice(d?.price ?? null))
      .catch(() => setPrice(null))
  }, [domain])

  return (
    <div className="domain-suggestion-card">
      <div>
        <strong>{domain}</strong>
        <div style={{marginTop:8}}>
          <Tag type={status||'neutral'}>{status}</Tag>
        </div>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {price ? <span>${price}</span> : null}
        <button className="gds-btn gds-btn-primary" onClick={() => onSelect?.(domain)}>Select</button>
      </div>
    </div>
  )
}
