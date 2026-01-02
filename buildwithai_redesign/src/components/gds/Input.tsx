import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helper?: string
  error?: string | boolean
}

export default function Input({ label, error, helper, ...props }: Props){
  const errorText = typeof error === 'string' ? error : undefined

  return (
    <div className="gds-input-wrapper">
      {label && <label className="gds-input-label">{label}</label>}

      <input
        className={`gds-input ${error ? 'gds-input-error' : ''}`}
        {...props}
      />

      {helper && !error && (
        <span className="gds-input-helper">{helper}</span>
      )}

      {errorText && (
        <span className="gds-input-error-text">{errorText}</span>
      )}
    </div>
  )
}
import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string
  label?: string
}

export default function Input({ id, label, className = '', ...props }: InputProps) {
  const inputId = id || `gds-input-${Math.random().toString(36).slice(2,8)}`

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {label ? <label htmlFor={inputId} style={{fontSize:14,fontWeight:600}}>{label}</label> : null}
      <input id={inputId} className={`gds-input ${className}`} {...props} />
    </div>
  )
}
