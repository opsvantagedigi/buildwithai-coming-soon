import React from 'react'
import Link from 'next/link'
import ReleaseCard from '@/components/gds/ReleaseCard'
import { releases } from '@/data/releases'

export default function ReleasesPage(){
  return (
    <main style={{padding:32}}>
      <h1 style={{fontSize:28,fontWeight:700}}>Releases</h1>
      <p style={{marginTop:8}}>Release history and notes.</p>

      <section style={{display:'grid',gap:16,marginTop:20}}>
        {releases.map(r => (
          <Link key={r.slug} href={`/releases/${r.slug}`} legacyBehavior>
            <a style={{textDecoration:'none',color:'inherit'}}>
              <ReleaseCard {...r} />
            </a>
          </Link>
        ))}
      </section>
    </main>
  )
}
