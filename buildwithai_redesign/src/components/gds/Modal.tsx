import React from 'react'

type Props = {
  open: boolean
  title?: React.ReactNode
  children?: React.ReactNode
  onClose?: () => void
  actions?: React.ReactNode
}

export default function Modal({ open, title, children, onClose, actions }: Props){
  if (!open) return null

  return (
    <div className="gds-modal-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="gds-modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="gds-modal-header">{title}</h2>}
        <div className="gds-modal-body">{children}</div>
        <div className="gds-modal-actions">{actions}</div>
      </div>
    </div>
  )
}
