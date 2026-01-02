import React from 'react'
import Link from 'next/link'

type NavItem = { href: string; label: string; title?: string }

export default function Nav({ items = [] as NavItem[], className = '' }: { items?: NavItem[]; className?: string }) {
  return (
    <nav className={`gds-nav ${className}`} aria-label="main navigation">
      {items.map((it) => (
        <Link key={it.href} href={it.href} legacyBehavior>
          <a title={it.title || it.label}>{it.label}</a>
        </Link>
      ))}
    </nav>
  )
}
