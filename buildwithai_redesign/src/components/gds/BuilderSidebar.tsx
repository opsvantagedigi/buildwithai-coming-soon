import React from 'react'
import Link from 'next/link'

export default function BuilderSidebar(){
  return (
    <aside className="builder-sidebar">
      <h3>Pages</h3>
      <ul>
        <li><Link href="/builder/site/home">Home</Link></li>
        <li><Link href="/builder/site/about">About</Link></li>
        <li><Link href="/builder/site/services">Services</Link></li>
        <li><Link href="/builder/site/contact">Contact</Link></li>
      </ul>

      <h3>Branding</h3>
      <button className="gds-btn gds-btn-secondary">Regenerate Colors</button>

      <h3>Domain Status</h3>
      <p>Connected</p>
    </aside>
  )
}
