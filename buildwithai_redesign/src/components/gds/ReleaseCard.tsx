import React from 'react'
import Card from './Card'

type ReleaseCardProps = {
  version: string
  title: string
  date: string
  tags?: string[]
  summary?: string
}

export default function ReleaseCard({ version, title, date, tags = [], summary = '' }: ReleaseCardProps) {
  return (
    <Card className="gds-release-card" header={`${version} — ${title}`}>
      <div className="meta" aria-hidden>
        <div className="gds-tag">{date}</div>
        {tags.slice(0,3).map((t: string) => (
          <span key={t} className="gds-tag" aria-label={`tag ${t}`}>{t}</span>
        ))}
      </div>
      <p>{summary}</p>
    </Card>
  )
}
