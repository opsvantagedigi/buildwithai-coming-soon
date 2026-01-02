import React from 'react'
import Link from 'next/link'
import { docsIndex } from '@/data/docs'

export default function DocsNav(){
  return (
    <nav style={{position:'sticky',top:24}} aria-label="Documentation navigation">
      {docsIndex.map(section => (
        <div key={section.title} style={{marginBottom:20}}>
          <h4 style={{fontSize:14,fontWeight:700,marginBottom:8}}>{section.title}</h4>
          <ul style={{listStyle:'none',padding:0,margin:0}}>
            {section.items.map(item => (
              <li key={item.slug} style={{marginBottom:6}}>
                <Link href={`/docs/${item.slug}`} legacyBehavior>
                  <a style={{color:'#0b3d91',textDecoration:'none'}}>{item.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
