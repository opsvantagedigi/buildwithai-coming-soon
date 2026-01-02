import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id?: string
  label?: string
  helper?: string
  error?: string | boolean
}

export default function Input({ id, label, helper, error, className = '', ...props }: InputProps) {
  const inputId = id || `gds-input-${Math.random().toString(36).slice(2,8)}`
  const errorText = typeof error === 'string' ? error : undefined

  return (
    <div className="gds-input-wrapper">
      {label ? <label htmlFor={inputId} className="gds-input-label">{label}</label> : null}

      <input id={inputId} className={`gds-input ${error ? 'gds-input-error' : ''} ${className}`} {...props} />

      {helper && !error && <span className="gds-input-helper">{helper}</span>}
      {errorText && <span className="gds-input-error-text">{errorText}</span>}
    </div>
  )
}
