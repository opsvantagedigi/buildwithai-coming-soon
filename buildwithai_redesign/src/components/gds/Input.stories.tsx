import React from 'react'
import Input from './Input'

export default {
  title: 'GDS/Input',
  component: Input,
}

export const Basic = () => <Input label="Name" placeholder="Enter name" />
export const Error = () => <Input label="Email" error="Invalid email" />
