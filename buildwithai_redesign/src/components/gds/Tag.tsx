import React from 'react'

export default function Tag({ type = 'neutral', children }: { type?: string; children: React.ReactNode }){
  return <span className={`gds-tag gds-tag-${type}`}>{children}</span>
}
