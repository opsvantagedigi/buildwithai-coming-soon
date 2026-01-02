import React from 'react'
import DocsNav from './DocsNav'
import DocsContent from './DocsContent'

export default function DocsLayout({ children }: { children: React.ReactNode }){
  return (
    <div style={{display:'flex',gap:24,padding:32}}>
      <aside style={{width:260}}>
        <DocsNav />
      </aside>
      <main style={{flex:1}}>
        <DocsContent>{children}</DocsContent>
      </main>
    </div>
  )
}
