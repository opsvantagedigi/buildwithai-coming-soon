import React from 'react'
import Header from '@/components/gds/Header'
import BuilderSidebar from '@/components/gds/BuilderSidebar'
import BuilderToolbar from '@/components/gds/BuilderToolbar'
import AISectionControls from '@/components/gds/AISectionControls'
import BrandingControls from '@/components/gds/BrandingControls'

type Props = { params: { id: string } }

export default function BuilderCanvas({ params }: Props){
  return (
    <>
      <Header />

      <BuilderToolbar onPreview={()=>console.log('Preview')} onPublish={()=>console.log('Publish')} />

      <main className="builder-canvas" style={{display:'grid',gridTemplateColumns:'260px 1fr 320px',gap:16,padding:24}}>
        <BuilderSidebar />

        <section className="builder-preview" style={{background:'#fff',padding:16,borderRadius:8}}>
          <iframe src="/preview" className="builder-iframe" style={{width:'100%',height:600,border:'none'}} />

          <AISectionControls onRegenerate={()=>console.log('Regenerate section')} onRewrite={()=>console.log('Rewrite text')} />

          <BrandingControls onColorChange={(v)=>console.log('Color theme:',v)} onToneChange={(v)=>console.log('Tone:',v)} />
        </section>

        <aside style={{padding:16}}>
          <h3>AI Suggestions</h3>
          <p>Regenerate a section or update tone.</p>
        </aside>
      </main>
    </>
  )
}
