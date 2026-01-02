import React from 'react'
import BuilderToolbar from './BuilderToolbar'

export default { title: 'GDS/BuilderToolbar' }

export const Default = () => <BuilderToolbar onPreview={()=>console.log('preview')} onPublish={()=>console.log('publish')} />
