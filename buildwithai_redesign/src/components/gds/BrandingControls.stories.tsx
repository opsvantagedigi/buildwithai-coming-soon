import React from 'react'
import BrandingControls from './BrandingControls'

export default { title: 'GDS/BrandingControls' }

export const Default = () => <BrandingControls onColorChange={(v)=>console.log('color',v)} onToneChange={(v)=>console.log('tone',v)} />
