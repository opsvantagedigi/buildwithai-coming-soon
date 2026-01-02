import React from 'react'
import path from 'path'
import fs from 'fs'
import DocsLayout from '@/components/docs/DocsLayout'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

type Props = { params: { slug: string[] } }

export default async function DocPage({ params }: Props){
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

  const raw = fs.readFileSync(filePath, 'utf8')
  const mdxSource = await serialize(raw)

  return (
    <DocsLayout>
      <article className="docs-prose">
        <MDXRemote {...mdxSource} />
      </article>
    </DocsLayout>
  )
}
