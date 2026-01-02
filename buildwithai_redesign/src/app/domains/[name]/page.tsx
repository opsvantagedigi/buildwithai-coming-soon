import React from 'react'
import Header from '@/components/gds/Header'
import Table from '@/components/gds/Table'

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
        <Table columns={columns} rows={rows} />
      </main>
    </>
  )
}
