import React from 'react'
import Header from '@/components/gds/Header'
import Tag from '@/components/gds/Tag'

export default function BuilderDomain(){
  return (
    <>
      <Header />

      <main className="builder-domain" style={{padding:32,maxWidth:900,margin:'0 auto',display:'flex',flexDirection:'column',gap:16}}>
        <h1>Choose a Domain</h1>

        <div className="domain-row" style={{display:'flex',alignItems:'center',gap:12}}>
          <span>skylineconsulting.com</span>
          <Tag type="available">Available</Tag>
          <button className="gds-btn gds-btn-primary">Select</button>
        </div>

        <div className="domain-row" style={{display:'flex',alignItems:'center',gap:12}}>
          <span>skylineconsulting.ai</span>
          <Tag type="taken">Taken</Tag>
          <button className="gds-btn gds-btn-secondary">View RDAP</button>
        </div>

        <a href="/builder/generate" className="gds-btn gds-btn-primary">Continue</a>
      </main>
    </>
  )
}
