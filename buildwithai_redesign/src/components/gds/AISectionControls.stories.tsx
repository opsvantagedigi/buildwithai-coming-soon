import React from 'react'
import AISectionControls from './AISectionControls'

export default { title: 'GDS/AISectionControls' }

export const Default = () => <AISectionControls onRegenerate={()=>console.log('regen')} onRewrite={()=>console.log('rewrite')} />
