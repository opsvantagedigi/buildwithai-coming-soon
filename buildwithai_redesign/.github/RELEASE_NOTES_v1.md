Release Notes — Domain Intelligence Engine (v1.0)

This release introduces a full registrar-grade domain intelligence layer, including:

✨ New Features
- AI-powered domain recommendations
- Domain health scoring with human-readable explanations
- DNS diagnostics (nameserver diversity, DNSSEC, configuration warnings)
- SEO domain scoring (brandability, length, hyphens, TLD trust)
- Registrar reputation scoring
- Expanded TLD pricing table with categories + notes
- Live availability checks (RDAP-based)
- Admin KV dashboard (/admin/kv)
- Scheduled KV warm job (Vercel cron)
- Deploy-time KV connectivity check

🔐 Security
- /admin/* routes now require ADMIN_DASHBOARD_TOKEN
- Middleware enforces 401/500 behavior
- Admin UI updated with secure guidance

⚙️ Infrastructure
- KV caching integrated across RDAP, availability, and warm jobs
- Cron job warms popular domains every 6 hours
- KV health endpoint added
- Pricing fallback now structured + extensible

🧪 Testing
- All new modules covered by unit tests
- Full test suite passing
- Build validated locally

Suggested reviewers
- Ajay (repo owner)
- An infra/Next.js reviewer
- Optional: UI/UX reviewer for the admin page

Pre-merge checklist (please verify before merging)
- KV enabled in Vercel and KV env vars set
- ADMIN_DASHBOARD_TOKEN set in Vercel
- /admin/kv returns 401 without token
- /admin/kv?token=TOKEN loads the admin UI
- /api/kv/health returns { "success": true }
- Cron scheduled in Vercel and visible in dashboard
- Warm job functions and writes to KV

Post-merge next steps (recommended)
1. Add KV caching for availability checks (KV TTL ~10 minutes)
2. Add async background enrichment for recommendation availability (job-based, KV-stored results)
3. Add admin login page that sets a secure session cookie (avoid token in URL)

Testing instructions
- Run `npm run build` and `npm test` locally
- Deploy to a preview environment and verify the pre-merge checklist above
- Run a manual warm via POST /api/kv/warm with a short domain list
