export const releases = [
  {
    version: 'v1.1.0',
    title: 'Domain Intelligence + KV Migration',
    date: '2026-01-02',
    summary: 'Replaced WHOIS with RDAP, added KV caching with Upstash REST fallback, and introduced health/warm endpoints.',
    tags: ['domain-intel', 'infra', 'kv'],
    slug: 'v1-1-0',
    githubUrl: 'https://github.com/opsvantagedigi/buildwithai-coming-soon/releases/tag/v1.1.0',
    details: `
Highlights:
- Replaced WHOIS with canonical RDAP lookups.
- Implemented runtime KV adapter with Vercel KV primary and Upstash REST fallback.
- Added /api/kv/health and /api/cron/warm endpoints and a scheduled warm job.
`
  }
]

export function findBySlug(slug: string) {
  return releases.find((r) => r.slug === slug)
}
