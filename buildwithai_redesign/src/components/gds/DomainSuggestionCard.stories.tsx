import React from 'react'
import DomainSuggestionCard from './DomainSuggestionCard'

export default { title: 'GDS/DomainSuggestionCard' }

export const Available = () => (
  <DomainSuggestionCard domain="example.dev" onSelect={()=>alert('selected')} />
)

export const Taken = () => (
  <DomainSuggestionCard domain="taken.com" onSelect={()=>{}} />
)
