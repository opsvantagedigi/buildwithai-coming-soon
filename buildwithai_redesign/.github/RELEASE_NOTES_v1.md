Release: Domain Intelligence + KV Migration (1.1.0)

Summary

This release completes the Domain Intelligence migration to a production-ready caching and KV architecture. It introduces RDAP canonicalization, an in-memory cache with an Upstash REST fallback, merged domain info endpoints, warm jobs, health endpoints, and admin protections.

Highlights

- Replaced legacy WHOIS flows with RDAP canonicalization.
- Added caching with an in-memory TTL cache and an optional Vercel KV adapter.
- Implemented an Upstash REST fallback so KV works even when Vercel KV bindings are not present.
- Merged RDAP/pricing/availability into `/api/domain/info` and added a `/domains` UI.
- Added `/api/kv/health` and `/api/kv/warm` endpoints plus `/api/cron/warm` scheduled job.
- Hardened admin UI with `ADMIN_DASHBOARD_TOKEN` middleware.
- Postbuild and runtime health checks (`scripts/check-kv.js`, `/api/kv/health`).
- Documentation added: `docs/domain-intel-kv-upstash.md`.

KV migration details

- Primary approach: load `@vercel/kv` at runtime if available and envs are set.
- Fallback: If `@vercel/kv` cannot be used, the runtime maps `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into the expected `KV_REST_API_*` names and provides a minimal REST client to `get`, `set`, and `expire` on Upstash.
- Tokens supported:
	- `KV_REST_API_URL`, `KV_REST_API_TOKEN` (preferred)
	- `KV_REST_API_WRITE_TOKEN` (explicit write token)
	- `KV_REST_API_READ_ONLY_TOKEN` (read-only)
	- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (fallback)

Warm job improvements

- `GET /api/cron/warm` fetches curated domains, retrieves canonical RDAP, and persists them into KV with TTL.
- Warm runs reduce RDAP upstream load and improve read latency.

Health endpoint

- `/api/kv/health` confirms KV connectivity and read/write persistence; returns `{"success": true, "kv": "connected"}` when verified.
- Build-time `scripts/check-kv.js` uses `NEXT_PUBLIC_SITE_URL` to validate the production health endpoint during postbuild.

Breaking changes

- WHOIS endpoint replaced by RDAP; any external integrations expecting WHOIS formatting should be updated.
- If deployments relied on a different KV env naming scheme, ensure `UPSTASH_REDIS_REST_*` or `KV_REST_API_*` are configured.

Upgrade instructions

1. Add required environment variables to Vercel (Production + Preview):
	 - `NEXT_PUBLIC_SITE_URL` (absolute URL for build checks)
	 - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`/`KV_REST_API_TOKEN`)
	 - Optional: `KV_REST_API_WRITE_TOKEN` for explicit write permission
2. Redeploy the project.
3. Validate `/api/kv/health` and run `/api/cron/warm` manually to verify warm writes.

Notes

- A no-write fallback to explicitly disable writes when only read-only tokens are present is available as a suggested next enhancement.

Prepared by: Build/Dev automation (2026-01-02)
