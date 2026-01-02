import React from 'react'

export default function Card({ title, children }: { title?: React.ReactNode; children: React.ReactNode }){
  return (
    <div className="gds-card">
      {title && <h3 className="gds-card-title">{title}</h3>}
      <div className="gds-card-body">{children}</div>
    </div>
  )
}
import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  header?: React.ReactNode
}

export default function Card({ children, className = '', header, ...props }: CardProps) {
  return (
    <div className={`gds-card ${className}`} role="group" aria-label={typeof header === 'string' ? header : undefined} {...props}>
      {header ? <div style={{marginBottom:12,fontWeight:700}}>{header}</div> : null}
      {children}
    </div>
  )
}
