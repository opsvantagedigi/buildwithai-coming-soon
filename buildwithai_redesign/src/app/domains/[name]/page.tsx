import React from 'react'
import Header from '@/components/gds/Header'
import Table from '@/components/gds/Table'
import DomainConnectHelper from '@/components/gds/DomainConnectHelper'
import DNSViewer from '@/components/gds/DNSViewer'
import RDAPPanel from '@/components/gds/RDAPPanel'

type Props = { params: { name: string } }

export default function DomainDetails({ params }: Props){
  const columns = [
    { key: 'type', label: 'Record Type' },
    { key: 'value', label: 'Value' },
  ]

  const rows = [
    { type: 'A', value: '76.76.21.21' },
    { type: 'CNAME', value: 'example.com' },
  ]

  return (
    <>
      <Header />

      <main className="domain-details" style={{padding:32,maxWidth:900,margin:'0 auto'}}>
        <h1>{params.name}</h1>

        <h2>DNS Records</h2>
        <DNSViewer domain={params.name} />

        <h2 style={{marginTop:32}}>RDAP</h2>
        <RDAPPanel domain={params.name} />

        <h2 style={{marginTop:32}}>Connect Domain</h2>
        <DomainConnectHelper domain={params.name} />
      </main>
    </>
  )
}
