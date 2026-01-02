import React from 'react'

type Props = {
  open?: boolean
  onClose?: ()=>void
  status?: 'idle'|'generating'|'done'
}

export default function AIGenerationModal({open, onClose, status='idle'}: Props){
  if(!open) return null

  return (
    <div className="gds-modal-overlay">
      <div className="gds-modal">
        <header>
          <h3>AI Generation</h3>
          <button className="gds-btn" onClick={onClose}>Close</button>
        </header>
        <main>
          {status==='generating' ? (
            <div className="ai-spinner">Generating... please wait</div>
          ) : status==='done' ? (
            <div className="ai-done">Done — review results</div>
          ) : (
            <div className="ai-idle">Ready to generate</div>
          )}
        </main>
      </div>
    </div>
  )
}


