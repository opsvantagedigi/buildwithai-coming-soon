import React from 'react'

type Props = { domain?: string }

export default function DomainConnectHelper({domain='example.com'}: Props){
  return (
    <div className="domain-connect">
      <h1>Connect {domain}</h1>

      <div className="domain-connect-step">
        <h3>Step 1: Add DNS Records</h3>
        <p>Add the following DNS records at your registrar:</p>
        <ul>
          <li><strong>A</strong> → 76.76.21.21</li>
          <li><strong>CNAME</strong> → your-site.vercel.app</li>
        </ul>
      </div>

      <div className="domain-connect-step">
        <h3>Step 2: Verify</h3>
        <button className="gds-btn gds-btn-primary">Check DNS</button>
      </div>
    </div>
  )
}
