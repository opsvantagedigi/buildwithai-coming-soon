# BUILD WITH AI — Pages frontend

This repository hosts the Cloudflare Pages frontend for BUILD WITH AI.

Overview
- `index.html` — homepage, uses shared layout and loads `/ui-config` for dynamic hero text and features.
- `dashboard.html` — administrative dashboard (templates grid, feature toggles, announcements, preview panel).
- `builder.html` — simple builder entry point and template selector.
- `assets/layout.css` — shared theme, layout, and motion rules.
- `assets/layout.js` — shared header/footer renderers and dashboard/builder client logic.

How the frontend talks to the Worker
- The frontend fetches the following Worker endpoints from the same origin:
  - `/ui-config` — returns hero text and feature flags
  - `/templates` — returns available templates (title, description, image, metadata)
  - `/announcements` — returns live announcements

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
To verify the Worker and frontend locally:

1. Start the Worker dev server (from the repo root):

```bash
cd worker
npx wrangler dev
```

2. Verify Worker endpoints (example using curl):

```bash
curl http://127.0.0.1:8787/ui-config
curl http://127.0.0.1:8787/templates
curl http://127.0.0.1:8787/announcements
curl http://127.0.0.1:8787/version
curl http://127.0.0.1:8787/health
```

3. Check the Pages frontend (open files in a browser or serve the repository as static files):
  - `/` (index.html) — hero text should come from `/ui-config` when Worker is running
  - `/dashboard.html` — templates, toggles, and announcements should load from Worker
  - `/builder.html` — templates and preview should load from Worker

4. Test fallback behavior:
  - Stop the Worker or disable network in DevTools.
  - Reload `/dashboard.html` — the UI should use files in `assets/sample-data/` and show the offline badge.
  - Click "Retry Loading" after restoring the Worker to verify it picks up live data again.

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

- Worker endpoints
- JSON structure
- Fallback sample-data
- Offline behavior
- Schema consistency

Notes
- By default the script expects the Worker dev server to be running at `http://127.0.0.1:8787` and will mark endpoint tests as failures if unreachable.
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
- The script will attempt to start `npx wrangler dev` in the `worker/` folder if a dev server is not already running on port 8787. If you prefer to run the dev server manually, start it before running the chaos test.
- The chaos test modifies `worker/src/routes/templates.js` temporarily and restores it automatically.
- Run the chaos test in a terminal with sufficient permissions; the script is designed to be cross-platform but needs `npx wrangler` available.


