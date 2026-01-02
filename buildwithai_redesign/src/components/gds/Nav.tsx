import React from 'react'

export default function Nav({ items = [] as any[], className = '' }: any) {
  return (
    <nav className={`gds-nav ${className}`} aria-label="main navigation">
      {items.map((it: any) => (
        <a key={it.href} href={it.href} title={it.title || it.label}>
          {it.label}
        </a>
      ))}
    </nav>
  )
}
