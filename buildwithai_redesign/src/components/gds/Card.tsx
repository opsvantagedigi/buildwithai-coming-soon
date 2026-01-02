import React from 'react'

export default function Card({ children, className = '', ...props }: any) {
  return (
    <div className={`gds-card ${className}`} {...props}>
      {children}
    </div>
  )
}
