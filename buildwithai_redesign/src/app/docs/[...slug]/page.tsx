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

  // Import the MDX file as a React component via dynamic require
  // Note: with @next/mdx this should be importable; use require to avoid build-time issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const MDXContent = require(`${filePath}`).default

  return (
    <DocsLayout>
      <MDXContent />
    </DocsLayout>
  )
}
