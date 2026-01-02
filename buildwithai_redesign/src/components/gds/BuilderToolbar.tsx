import React from 'react'

type Props = {
  onPreview?: ()=>void
  onPublish?: ()=>void
}

export default function BuilderToolbar({onPreview, onPublish}: Props){
  return (
    <div className="builder-toolbar">
      <div className="builder-toolbar-left">
        <button className="gds-btn gds-btn-secondary" onClick={onPreview}>Preview</button>
      </div>

      <div className="builder-toolbar-right">
        <button className="gds-btn gds-btn-primary" onClick={onPublish}>Publish</button>
      </div>
    </div>
  )
}
