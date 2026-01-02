import React from 'react'
import DNSViewer from './DNSViewer'

export default { title: 'GDS/DNSViewer' }

export const Default = () => <DNSViewer domain={"example.com"} />
export const Empty = () => <DNSViewer domain={"no-records.test"} />
