import rdap from './rdap'

export type AvailabilityResult = {
  domain: string
  available: boolean | null
  reason?: string
}

export async function checkDomainAvailability(domain: string): Promise<AvailabilityResult> {
  try {
    const data = await rdap.fetchRdap(domain)
    const norm = rdap.normalizeToCanonical(data)
    if (norm && typeof norm.registered === 'boolean') {
      return { domain, available: !norm.registered, reason: norm.registered ? 'Domain is registered' : 'Domain appears available' }
    }
    return { domain, available: null, reason: 'RDAP response did not indicate registration status' }
  } catch (err: any) {
    return { domain, available: null, reason: 'RDAP lookup failed' }
  }
}

export default checkDomainAvailability
