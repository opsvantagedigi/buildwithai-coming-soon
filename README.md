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
