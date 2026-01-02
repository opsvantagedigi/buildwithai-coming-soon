# Domain‑Intel: KV + Upstash Fallback (RDAP caching)

This document explains how the domain‑intel feature uses caching and KV, the environment variables involved, the runtime fallback behavior, the warm job semantics, the health endpoint signals, deployment notes, and troubleshooting steps.

## 1. Environment Variables

- `KV_REST_API_URL` (optional)
  - The REST API base URL consumed by `@vercel/kv`. Example: `https://...`.
- `KV_REST_API_TOKEN` (optional)
  - The REST API token used by `@vercel/kv` for read+write.
- `KV_REST_API_READ_ONLY_TOKEN` (optional)
  - A read-only REST token used by the app when writes are not permitted.
- `KV_REST_API_WRITE_TOKEN` (optional)
  - A write-capable REST token. Preferred when available.
- `UPSTASH_REDIS_REST_URL` (optional)
  - Upstash REST URL used as a fallback when `@vercel/kv` isn't configured.
- `UPSTASH_REDIS_REST_TOKEN` (optional)
  - Upstash REST token (read+write) used by the fallback client.
- `NEXT_PUBLIC_SITE_URL` (recommended)
  - Absolute URL used by build-time checks (postbuild health check).

Notes:
- The runtime adapter in `src/lib/kv.ts` maps and normalizes these envs at runtime so the app can use whichever values are present.
- Do not store plaintext tokens in repo; use encrypted Vercel environment variables.

## 2. Fallback Logic (how `src/lib/kv.ts` works)

Behavior summary:
- Primary: try to load `@vercel/kv` at runtime using a guarded `eval('require')` call. If present and envs are populated, `@vercel/kv` is used.
- Env mapping: if `KV_REST_API_URL` / `KV_REST_API_TOKEN` are not set, the code maps `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (and `KV_REST_API_WRITE_TOKEN`) into those expected variables so the library can pick them up.
- Upstash REST fallback: if `@vercel/kv` is unavailable but `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` exist, the code uses a minimal REST client that implements `get`, `set`, and `expire` against Upstash REST endpoints.

Why the fallback exists:
- In some deployment setups (preview, hobby, manual), `@vercel/kv` bindings may not be present or may be configured under different env names (Upstash). The fallback ensures caching works regardless.

Read‑only vs write behavior:
- If only a read-only token is present, the library maps it for reads and may still attempt writes (best-effort). Consider enabling the optional "no-write fallback" described in Troubleshooting to block writes explicitly when only read tokens exist.

API contract used in code:
- `kvGetRdap(domain)` -> returns stored value or `null`.
- `kvSetRdap(domain, value)` -> returns set result (boolean/true on success) or `null` on failure.

## 3. Warm Job Behavior

Endpoint: `GET /api/cron/warm`
- Purpose: fetch a curated list of domains and fetch canonicalized RDAP results, then write them into KV for fast reads.

Expectations:
- Write: `kvSetRdap()` should return a success indicator (e.g., `true`) when writes succeed.
- Read: subsequent `kvGetRdap()` calls should return the cached RDAP object.
- Persistence: values are stored with a TTL (configurable in `src/lib/kv.ts` as `RDAP_TTL_SECONDS`), so warm job refreshes them periodically.

Latency expectations (rough guide):
- KV read: typically < 10ms (network permitting).
- RDAP upstream fetch: ~200–600ms depending on provider/region and network.
- Warm job: initial run includes RDAP upstream latency; subsequent reads served from KV are significantly faster.

Failure modes:
- Write fails (no write token / permission): warm job may still fetch RDAP but cannot persist it. The health endpoint will report `no-read` or `read-only` depending on configuration.
- Upstream RDAP errors: warm job logs errors per domain and skips or retries based on job logic.

## 4. Health Endpoint Semantics (`/api/kv/health`)

Returned JSON shape:
- `{"success": true, "kv": "connected"}` — writes and reads succeeded and persistence verified.
- `{"success": true, "kv": "no-read"}` — read or write not available; endpoint reachable but KV read returned null.
- `{"success": false, "error": "..."}` — error while running health checks.

Optional future state:
- `read-only` — explicitly indicates only read token present (if you enable a no-write fallback).

Runtime logs:
- The health route logs presence of the relevant env vars (boolean presence only; secrets never logged) and the set/get results in a compact, non-secret form to allow quick troubleshooting in Vercel logs.

## 5. Deployment Notes

Required to enable full caching/warm behavior:
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (if using Upstash)
- OR `KV_REST_API_URL` + `KV_REST_API_TOKEN` (Vercel KV REST API)
- `NEXT_PUBLIC_SITE_URL` (for build-time absolute checks like `scripts/check-kv.js`)
- `ADMIN_DASHBOARD_TOKEN` (admin UI protection)

Optional but recommended:
- `KV_REST_API_WRITE_TOKEN` (explicit write token) — simplifies permission model.
- `KV_REST_API_READ_ONLY_TOKEN` (explicit read-only token) — for safe read-only deployments.

How to test locally:
1. Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in `.env.development.local` (never commit secrets).
2. Run `npm run dev` and call:

```bash
curl -sS http://localhost:3000/api/kv/health
curl -sS http://localhost:3000/api/cron/warm
```

How to test in production:
1. Deploy to Vercel with the required envs.
2. Trigger `/api/cron/warm` (manually or via scheduled cron) and validate `/api/kv/health` returns `{"success": true, "kv": "connected"}`.
3. Inspect Vercel runtime logs for `[KV RUNTIME] kvSetRdap` and `[KV RUNTIME] kvGetRdap` messages.

## 6. Troubleshooting

Missing write token
- Symptom: warm job fetches RDAP but KV writes report `null` or `undefined` and health returns `no-read`.
- Check: Vercel envs for `KV_REST_API_WRITE_TOKEN`, `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_TOKEN`.
- Fix: Add write-capable token to Vercel env (Production + Preview) and redeploy.

Missing read token
- Symptom: reads return `null` even after successful set attempts.
- Check: ensure the `KV_REST_API_*` or Upstash envs are set in the environment used by the running instance.

Upstash permission issues
- Symptom: REST calls return 401/403 or set/get returns error in logs.
- Check: Upstash token capability (read vs read+write) in Upstash dashboard.

Vercel env resolution issues
- Symptom: `@vercel/kv` throws missing env error at runtime.
- Check: `src/lib/kv.ts` maps `UPSTASH_*` envs into `KV_REST_API_*` at runtime; ensure Upstash env names exist if not using Vercel KV.

Optional: No‑write fallback
- If you want explicit read-only behavior in production (no accidental writes when only a read-only token is present), add a check in `kvSetRdap` to detect presence of a write token (`KV_REST_API_WRITE_TOKEN` or `KV_REST_API_TOKEN`) and skip set when missing. This is safe but optional; current implementation attempts writes and logs result.

## 7. Files of interest
- `src/lib/kv.ts` — runtime adapter, env mapping, Upstash REST fallback
- `src/app/api/kv/health/route.ts` — health endpoint and runtime logs
- `src/app/api/cron/warm/route.ts` — warm job implementation
- `scripts/check-kv.js` — postbuild check that hits the health endpoint using `NEXT_PUBLIC_SITE_URL`

## 8. Next recommended actions
- Commit this document (done) and share with stakeholders.
- Optionally implement explicit no‑write fallback if you want stricter behavior.
- Add a short release note summarizing the migration and link this doc.

---
Generated: January 2, 2026
