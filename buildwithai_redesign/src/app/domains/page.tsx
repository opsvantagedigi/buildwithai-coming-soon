import React from 'react'
import Header from '@/components/gds/Header'
import Input from '@/components/gds/Input'
import Tag from '@/components/gds/Tag'

export default function DomainSearch(){
  return (
    <>
      <Header />

      <main className="domain-search" style={{padding:32,maxWidth:900,margin:'0 auto',display:'flex',flexDirection:'column',gap:16}}>
        <h1>Search Domains</h1>

        <Input label="Domain" placeholder="example.com" />

        <div className="domain-row" style={{display:'flex',alignItems:'center',gap:12}}>
          <span>example.com</span>
          <Tag type="available">Available</Tag>
          <button className="gds-btn gds-btn-primary">Select</button>
        </div>
      </main>
    </>
  )
}

