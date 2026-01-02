import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'subtle'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  loading?: boolean
}

export default function Button({ variant = 'primary', loading = false, children, className = '', disabled, ...props }: Props){
  const variantClass = (() => {
    switch (variant) {
      case 'secondary': return 'gds-btn-secondary'
      case 'ghost': return 'gds-btn-ghost'
      case 'destructive': return 'gds-btn-destructive'
      case 'subtle': return 'gds-btn-ghost'
      default: return 'gds-btn-primary'
    }
  })()

  const isDisabled = disabled || loading

  return (
    <button
      className={`gds-btn ${variantClass} ${loading ? 'gds-btn-loading' : ''} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  )
}
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export default function Button({ children, variant = 'primary', className = '', loading = false, leftIcon, rightIcon, disabled, ...props }: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={`gds-btn ${variant} ${isDisabled ? 'disabled' : ''} ${className}`}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <svg width="16" height="16" viewBox="0 0 50 50" aria-hidden="true" focusable="false" style={{marginRight:8}}>
          <circle cx="25" cy="25" r="20" stroke="rgba(255,255,255,0.6)" strokeWidth="5" fill="none" strokeDasharray="31.4 31.4">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
          </circle>
        </svg>
      ) : leftIcon ? (
        <span style={{display:'inline-flex',marginRight:8,alignItems:'center'}}>{leftIcon}</span>
      ) : null}

      <span style={{display:'inline-flex',alignItems:'center',gap:8}}>{children}</span>

      {rightIcon ? <span style={{display:'inline-flex',marginLeft:8,alignItems:'center'}}>{rightIcon}</span> : null}
    </button>
  )
}
