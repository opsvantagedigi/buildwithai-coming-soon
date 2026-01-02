"use client"
import React, { useEffect, useState } from 'react'
import Table from './Table'

type DNSRecord = { type?: string; value?: string; ttl?: number }

type Props = { domain?: string }

export default function DNSViewer({ domain }: Props){
  const [records, setRecords] = useState<DNSRecord[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!domain) return
    setLoading(true)
    fetch(`/api/domain/dns?domain=${encodeURIComponent(domain)}`)
      .then((r) => r.json())
      .then((data) => setRecords(data.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [domain])

  if (loading) {
    return (
      <div className="dns-viewer">
        <h3>DNS Records</h3>
        <p>Loading...</p>
      </div>
    )
  }

  if (!records || records.length === 0) {
    return (
      <div className="dns-viewer">
        <h3>DNS Records</h3>
        <p>No DNS records found.</p>
      </div>
    )
  }

  const columns = [
    { key: 'type', label: 'Type' },
    { key: 'value', label: 'Value' },
    { key: 'ttl', label: 'TTL' }
  ]

  return (
    <div className="dns-viewer">
      <h3>DNS Records</h3>
      <Table columns={columns} rows={records} />
    </div>
  )
}
