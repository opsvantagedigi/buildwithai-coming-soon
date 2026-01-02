import React from 'react'

export default function Button({ children, variant = 'primary', className = '', ...props }: any) {
  return (
    <button className={`gds-btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}
