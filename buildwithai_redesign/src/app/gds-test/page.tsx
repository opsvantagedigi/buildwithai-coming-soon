"use client"
import React from 'react'
import Button from '@/components/gds/Button'
import Input from '@/components/gds/Input'
import Card from '@/components/gds/Card'
import Nav from '@/components/gds/Nav'
import ReleaseCard from '@/components/gds/ReleaseCard'

export default function GdsTestPage(){
  return (
    <main style={{padding:32}}>
      <h1 style={{fontFamily:'Orbitron, system-ui',fontSize:24}}>GDS Smoke Test</h1>

      <section style={{marginTop:20}}>
        <Nav items={[{href:'/',label:'Home'},{href:'/builder',label:'Builder'},{href:'/domains',label:'Domains'}]} />
      </section>

      <section style={{display:'grid',gap:16,gridTemplateColumns:'1fr 1fr',marginTop:20}}>
        <Card>
          <h2>Controls</h2>
          <Input placeholder="Search domain" />
          <div style={{height:12}} />
          <Button>Primary Action</Button>
          <div style={{height:8}} />
          <Button variant="secondary">Secondary</Button>
        </Card>

        <Card>
          <h2>Release Card</h2>
          <ReleaseCard version="v1.1.0" title="Domain Intelligence + KV Migration" date="2026-01-02" tags={["domain-intel","infra"]} summary="Replaced WHOIS with RDAP, added KV fallback, and health endpoints." />
        </Card>
      </section>

      <section style={{marginTop:24}}>
        <h3>Quick checks</h3>
        <ul>
          <li>Buttons should show brand color</li>
          <li>Inputs should use spacing and radius tokens</li>
          <li>Cards should show shadow and surface tokens</li>
        </ul>
      </section>
    </main>
  )
}
