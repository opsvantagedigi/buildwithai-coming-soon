import React from 'react'

type Props = {
  onRegenerate?: ()=>void
  onRewrite?: ()=>void
}

export default function AISectionControls({onRegenerate,onRewrite}: Props){
  return (
    <div className="ai-section-controls">
      <button className="gds-btn gds-btn-secondary" onClick={onRewrite}>Rewrite Text</button>
      <button className="gds-btn gds-btn-primary" onClick={onRegenerate}>Regenerate Section</button>
    </div>
  )
}
