import React from 'react'

export default function DocsContent({ children }: { children: React.ReactNode }){
  return (
    <article style={{maxWidth:900}} className="docs-prose">
      {children}
    </article>
  )
}
