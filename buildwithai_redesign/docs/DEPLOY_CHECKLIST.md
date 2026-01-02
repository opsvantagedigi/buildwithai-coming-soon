# OpsVantage Digital — Build With AI
## Phase 5 Deployment Ritual

This checklist ensures every deployment of the AI Website Builder is stable, intentional, and fully validated — including Domain‑Intel, GDS, Admin UX, and Builder flows.

### 1. PRE‑DEPLOY CHECKS

1.1 Local Build

- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Confirm no TypeScript errors
- [ ] Confirm no missing assets (CSS, components, images)
- [ ] Confirm no unused imports or warnings that may break Vercel builds

1.2 GDS Verification

- [ ] Open `/gds-test` locally
- [ ] Confirm:
  - Buttons use brand tokens
  - Inputs use spacing + radius tokens
  - Cards use shadows + surface tokens
  - Typography = Orbitron + Inter
  - No FOUC or hydration warnings

1.3 Domain‑Intel Verification

- [ ] Hit `/api/kv/health` locally → expect `{ "success": true, "kv": "connected" }`
- [ ] Hit `/api/cron/warm` locally → expect warmed domains list
- [ ] Confirm NO_WRITE_FALLBACK behavior if enabled
- [ ] Confirm RDAP caching works (KV read/write logs)

1.4 Environment Variables

- [ ] Ensure required env vars exist in Vercel:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`
  - `KV_REST_API_WRITE_TOKEN`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  - `ADMIN_DASHBOARD_TOKEN`
  - `NEXT_PUBLIC_SITE_URL`
- [ ] Confirm no stale or unused env vars

### 2. DEPLOY

2.1 Commit & Push

- [ ] Stage changes
- [ ] Commit with clear message
- [ ] Push to `main`

2.2 Trigger Vercel Deploy

- [ ] Run `npx vercel --prod --yes` (or rely on Git integration)
- [ ] Watch build logs for:
  - Missing files
  - CSS import issues
  - Build-time errors
  - KV binding issues

2.3 Confirm Production Alias

- [ ] Ensure deployment is aliased to: `https://buildwithai.digital`

### 3. POST‑DEPLOY VALIDATION

3.1 GDS Smoke Test

- [ ] Visit `/gds-test` in production
- [ ] Confirm tokens applied, components render, no console errors

3.2 Domain‑Intel Validation

- [ ] Hit `/api/kv/health` → expect `connected`
- [ ] Hit `/api/cron/warm` → expect warmed domains
- [ ] Check Vercel logs for `kvSetRdap` and `kvGetRdap` success

3.3 Builder Entry Points

- [ ] Visit `/builder` — page loads, styles applied, no hydration issues

3.4 Admin Dashboard

- [ ] Visit `/admin` — token middleware works, KV health widget loads

### 4. RELEASE RITUAL

4.1 Update Documentation

- [ ] Update `CHANGELOG.md`
- [ ] Add/update docs in `/docs`
- [ ] Add new release entry in `releases.ts`

4.2 Publish GitHub Release

- [ ] Tag version
- [ ] Publish release notes with links to docs and changelog

4.3 Admin “What’s New”

- [ ] Update latest release card in Admin dashboard

### 5. OPTIONAL CHECKS (recommended before major launches)

- [ ] Template gallery smoke-test
- [ ] Clone/edit existing site flow
- [ ] SEO panel checks (title/meta)
- [ ] Performance / Lighthouse spot check
- [ ] AI generation smoke-tests (site/section/page)

---

This file is a living artifact — update it whenever you add new Phase 5 features or change the deployment ritual.
