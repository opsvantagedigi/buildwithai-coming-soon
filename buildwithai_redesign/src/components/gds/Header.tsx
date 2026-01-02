import Link from 'next/link'
import React from 'react'

export default function Header(){
  return (
    <header className="gds-header">
      <div className="gds-header-logo">Build With AI</div>

      <nav className="gds-header-nav" aria-label="Main navigation">
        <Link href="/builder" className="gds-header-link">Builder</Link>
        <Link href="/domains" className="gds-header-link">Domains</Link>
        <Link href="/docs" className="gds-header-link">Docs</Link>
        <Link href="/releases" className="gds-header-link">Releases</Link>
      </nav>
    </header>
  )
}
