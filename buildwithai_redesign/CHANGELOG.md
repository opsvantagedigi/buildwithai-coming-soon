# Changelog

## 1.1.0 — Domain Intelligence + KV Migration (2026-01-02)
- Added Upstash REST fallback for KV when `@vercel/kv` is not present.
- Added runtime env mapping for `UPSTASH_REDIS_REST_*` -> `KV_REST_API_*`.
- Added `kvGetRdap` and `kvSetRdap` with TTL support and Upstash REST client fallback.
- Added `/api/kv/health` endpoint and presence logs for runtime instrumentation.
- Added `/api/kv/warm` and `/api/cron/warm` to warm and persist RDAP results.
- Replaced WHOIS flows with RDAP canonicalization and merged domain info endpoints.
- Hardened admin UI with `ADMIN_DASHBOARD_TOKEN` middleware.
- Added `docs/domain-intel-kv-upstash.md` documenting behavior and troubleshooting.

## 1.0.0 — Initial baseline
- Initial project baseline.
