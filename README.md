# BUILD WITH AI — Static frontend

This repository hosts the static frontend and Vercel serverless API for BUILD WITH AI.

Overview
- `index.html` — homepage, uses shared layout and loads `/ui-config` for dynamic hero text and features.
- `dashboard.html` — administrative dashboard (templates grid, feature toggles, announcements, preview panel).
- `builder.html` — simple builder entry point and template selector.
- `assets/layout.css` — shared theme, layout, and motion rules.
- `assets/layout.js` — shared header/footer renderers and dashboard/builder client logic.

How the frontend talks to the serverless API
- The frontend fetches the following API endpoints from the same origin (now under `/api`):
  - `/api/ui-config` — returns hero text and feature flags
  - `/api/templates` — returns available templates (title, description, image, metadata)
  - `/api/announcements` — returns live announcements

Notes
- All Worker backend changes are intentionally avoided here; the frontend consumes the above endpoints only.
- Pages root contains only static assets and HTML; the Worker remains in `/worker`.

Fallback & Offline
- `assets/sample-data/` contains local JSON fallbacks used when the Worker endpoints are unreachable:
  - `ui-config.json`, `templates.json`, `announcements.json`
- Frontend uses `assets/layout.js`'s `fetchWithFallback(primary, fallback)` to try the Worker first, then the local samples.
- If the browser is offline (`navigator.onLine === false`) the app immediately uses the local samples and shows an "Offline Mode — Using Local Data" badge in the header.

Skeletons, Error States, and AI placeholders
- The UI shows skeleton loaders (subtle shimmer) while fetching data.
- If both primary and fallback fail, a friendly error card is shown with a "Retry Loading" button.
- Sections that might take longer show a pulsing "AI is preparing your content…" style via CSS.

How to add or update sample data
- Edit or add files under `assets/sample-data/` following the existing structure.
- Use `/assets/previews/` for any template preview images (SVGs are used for samples).

Smoke-check & Verification
--------------------------
To verify the API and frontend locally:

1. Start the local dev server (Vercel or lightweight dev server):

```bash
# Option A: Vercel dev
npx vercel dev

# Option B: lightweight dev server (included)
node dev-server.mjs
```

2. Verify API endpoints (example using curl):

```bash
curl http://127.0.0.1:3000/api/ui-config
curl http://127.0.0.1:3000/api/templates
curl http://127.0.0.1:3000/api/announcements
curl http://127.0.0.1:3000/api/version
curl http://127.0.0.1:3000/api/health
```

3. Check the Pages frontend (open files in a browser or serve the repository as static files):
  - `/` (index.html) — hero text should come from `/api/ui-config` when the API is running
  - `/dashboard.html` — templates, toggles, and announcements should load from the API
  - `/builder.html` — templates and preview should load from the API

4. Test fallback behavior:
  - Stop the local API server or disable network in DevTools.
  - Reload `/dashboard.html` — the UI should use files in `assets/sample-data/` and show the offline badge.
  - Click "Retry Loading" after restoring the API server to verify it picks up live data again.

Expected endpoint shapes
------------------------
- `/ui-config` → object with `hero` (title, subtitle) and `features` (array)
- `/templates` → object or array: `{ templates: [ { id, name, description, preview }, ... ] }` or an array of templates
- `/announcements` → object `{ announcements: [ { title, message, timestamp }, ... ] }`

Verification
------------
After you run the smoke-checks, if everything is working the frontend should never display empty content; it will fall back to the sample-data files when Worker endpoints are unreachable.
 
## Automated Smoke Tests

### Run tests:

```bash
npm run test:smoke
```

### What it validates:

- API endpoints
- JSON structure
- Fallback sample-data
- Offline behavior
- Schema consistency

Notes
- By default the script expects the local dev server to be running at `http://127.0.0.1:3000` and will mark endpoint tests as failures if unreachable.
- To run the smoke tests in an offline-first mode (treat endpoint failures as warnings) set the environment variable `ALLOW_OFFLINE=1` when running the tests.

Examples
```bash
# Normal (fail if worker endpoints down)
npm run test:smoke

# Allow offline (still validates local sample-data)
ALLOW_OFFLINE=1 npm run test:smoke
```

## Chaos Testing

### Run chaos test:

```bash
npm run test:chaos
```

### What it does:

- Temporarily breaks /templates
- Confirms fallback sample-data works
- Confirms UI remains stable
- Restores original Worker code
- Validates recovery

Notes
-- The chaos test will attempt to use the local dev server to simulate failures and validate fallbacks.
-- The chaos test modifies local template files to simulate failures and restores them automatically.

## AI‑Powered Template Generation

This repository includes a lightweight, deterministic AI placeholder for generating templates locally.

-- Endpoint: `POST /api/generate-template`
- Request JSON: `{ "prompt": "Landing page for a fitness coach" }`
- Response JSON shape:

```
{
  "id": "generated-<hex>",
  "name": "Short Title",
  "description": "One sentence summary",
  "sections": [ { ... } ],
  "html": "<div>...</div>",
  "css": "..."
}
```

How the builder uses it:
- The builder page exposes a "Generate with AI" button that opens a prompt modal.
-- The prompt is POSTed to `/api/generate-template` and the returned `html`/`css` are injected into the preview panel for live preview.
-- If the API server is offline or the endpoint fails, the UI shows a friendly message and falls back to sample-data for templates.

Future upgrade path:
- Replace `worker/src/lib/ai.js` with an integration to a real AI provider (OpenAI, Anthropic, or your internal model). Keep the same `generateTemplate(prompt)` signature and return shape to remain compatible with the frontend.
- Add server-side validation, rate limiting, authentication, and billing checks before allowing high-rate generation.

## AI Generation Tests

Unit and integration tests verify the deterministic AI helper and the Builder integration.

- Run unit tests (Node's built-in test runner):

```bash
npm run test:ai
```

- Run integration tests (headless):

```bash
npm run test:builder
```

What they validate:
- `tests/ai/generateTemplate.test.js` ensures `generateTemplate(prompt)` returns the expected shape and deterministic ids.
-- `tests/builder/generateTemplate.integration.js` posts prompts to `/api/generate-template`, validates responses, simulates server downtime, checks fallback sample-data, and restores the API server.

These tests preserve the contract between the API and frontend and make it easier to replace the rule-based generator with a real AI provider in the future.



