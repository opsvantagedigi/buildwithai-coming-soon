import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode
  header?: React.ReactNode
}

export default function Card({ children, className = '', title, header, ...props }: CardProps) {
  const heading = title ?? header

  return (
    <div className={`gds-card ${className}`} role="group" aria-label={typeof heading === 'string' ? String(heading) : undefined} {...props}>
      {heading ? <div className="gds-card-title">{heading}</div> : null}
      <div className="gds-card-body">{children}</div>
    </div>
  )
}
