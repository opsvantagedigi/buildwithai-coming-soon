import React from 'react'

type Props = {
  onColorChange?: (v:string)=>void
  onToneChange?: (v:string)=>void
}

export default function BrandingControls({onColorChange,onToneChange}: Props){
  return (
    <div className="branding-controls">
      <h3>Branding</h3>

      <div className="branding-option">
        <label>Color Theme</label>
        <select className="gds-input" onChange={(e)=>onColorChange?.(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="vibrant">Vibrant</option>
        </select>
      </div>

      <div className="branding-option">
        <label>Writing Tone</label>
        <select className="gds-input" onChange={(e)=>onToneChange?.(e.target.value)}>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="bold">Bold</option>
          <option value="playful">Playful</option>
        </select>
      </div>
    </div>
  )
}
