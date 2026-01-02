import React from 'react'
import Link from 'next/link'
import { findBySlug } from '@/data/releases'

export default function ReleaseDetail({ params }: { params: { version: string } }){
  const { version } = params
  const release = findBySlug(version)

  if(!release) return (
    <main style={{padding:32}}>
      <h1>Release not found</h1>
      <p>No release found for {version}</p>
      <p><Link href="/releases" legacyBehavior><a>Back to releases</a></Link></p>
    </main>
  )

  return (
    <main style={{padding:32}}>
      <h1>{release.version} — {release.title}</h1>
      <p style={{color:'#6b7280'}}>{release.date}</p>
      <p style={{marginTop:12}}>{release.summary}</p>

      <section style={{marginTop:20}}>
        <h3>Details</h3>
        <pre style={{whiteSpace:'pre-wrap',background:'#f8fafc',padding:12,borderRadius:8}}>{release.details}</pre>
        <p style={{marginTop:12}}><a href={release.githubUrl} target="_blank" rel="noreferrer">View GitHub Release</a></p>
      </section>
    </main>
  )
}
