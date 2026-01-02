import React from 'react'
import Card from './Card'

export default function ReleaseCard({ version, title, date, tags = [], summary = '' }: any) {
  return (
    <Card className="gds-release-card">
      <div className="meta">
        <strong>{version}</strong>
        <div className="gds-tag">{date}</div>
        {tags.slice(0,3).map((t: string) => (
          <div key={t} className="gds-tag">{t}</div>
        ))}
      </div>
      <h3>{title}</h3>
      <p>{summary}</p>
    </Card>
  )
}
