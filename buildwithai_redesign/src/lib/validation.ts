import { z } from 'zod'

export const DomainCheckSchema = z.object({
  domain: z.string().min(1)
})

export const WhoisSchema = z.object({
  domain: z.string().min(1)
})

export const RegisterSchema = z.object({
  domain: z.string().min(1),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string().optional()
  }).optional(),
  nameservers: z.array(z.string()).optional()
})

export const DnsSchema = z.object({
  domain: z.string().min(1),
  records: z.array(z.object({ type: z.string(), name: z.string(), value: z.string() }))
})

export default { DomainCheckSchema, WhoisSchema, RegisterSchema, DnsSchema }
