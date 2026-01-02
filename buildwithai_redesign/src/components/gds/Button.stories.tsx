import React from 'react'
import Button from './Button'

export default {
  title: 'GDS/Button',
  component: Button,
}

export const Primary = () => <Button variant="primary">Primary</Button>
export const Secondary = () => <Button variant="secondary">Secondary</Button>
export const Ghost = () => <Button variant="ghost">Ghost</Button>
export const Destructive = () => <Button variant="destructive">Delete</Button>
export const Loading = () => <Button variant="primary" loading>Saving...</Button>
