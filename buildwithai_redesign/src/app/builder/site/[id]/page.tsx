import React from 'react'
import Header from '@/components/gds/Header'

type Props = { params: { id: string } }

export default function BuilderCanvas({ params }: Props){
  return (
    <>
      <Header />

      <main className="builder-canvas" style={{display:'grid',gridTemplateColumns:'260px 1fr 320px',gap:16,padding:24}}>
        <aside className="builder-sidebar" style={{padding:16,borderRadius:8,background:'#fff'}}>
          <h3>Pages</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
          </ul>

          <h3>Branding</h3>
          <button className="gds-btn gds-btn-secondary">Regenerate Colors</button>

          <h3>Domain Status</h3>
          <p>Connected</p>
        </aside>

        <section className="builder-preview" style={{background:'#fff',padding:16,borderRadius:8}}>
          <iframe src="/preview" className="builder-iframe" style={{width:'100%',height:600,border:'none'}} />
        </section>

        <aside style={{padding:16}}>
          <h3>AI Suggestions</h3>
          <p>Regenerate a section or update tone.</p>
        </aside>
      </main>
    </>
  )
}
