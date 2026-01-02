import React from 'react'
import path from 'path'
import fs from 'fs'
import DocsLayout from '@/components/docs/DocsLayout'

type Props = { params: { slug: string[] } }

export default function DocPage({ params }: Props){
  const slugPath = params.slug.join('/')
  const filePath = path.join(process.cwd(), 'src', 'data', 'docs', `${slugPath}.mdx`)

  if (!fs.existsSync(filePath)){
    return (
      <DocsLayout>
        <h1>Document not found</h1>
        <p>No document found for {slugPath}</p>
      </DocsLayout>
    )
  }

  // Read the MDX file and render as raw text for now. This avoids
  // build-time dynamic require issues with Turbopack. Later we can
  // compile/transform MDX to React when MDX tooling is installed.
  const content = fs.readFileSync(filePath, 'utf8')

  return (
    <DocsLayout>
      <article>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
      </article>
    </DocsLayout>
  )
}
