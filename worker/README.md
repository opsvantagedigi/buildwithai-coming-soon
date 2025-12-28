# buildwithai-worker

This folder contains a minimal Cloudflare Worker scaffold for local development and deployment with Wrangler. The Worker is intentionally isolated under `worker/` so the repository root can remain a static Cloudflare Pages site.

## 1) Authentication
Deployment/authentication instructions removed; configure your chosen deployment tool when ready.

## 2) Local development
Run the Worker source locally using your preferred local runtime (Miniflare, Node adapter, etc.) and run tests as needed. No Wrangler-specific local instructions are included here.

## 3) Deployment
Deployment instructions removed. Add deployment tooling and steps when you're ready to configure accounts, routes, and DNS.

## 4) Bindings examples (edit `worker/wrangler.toml` and uncomment/fill IDs)

KV namespace example:

```toml
kv_namespaces = [
  { binding = "BUILDWITHAI_CACHE", id = "xxxx" }
]
```

D1 database example:

```toml
[[d1_databases]]
binding = "BUILDWITHAI_DB"
database_name = "buildwithai"
database_id = "xxxx"
```

R2 bucket example:

```toml
r2_buckets = [
  { binding = "BUILDWITHAI_ASSETS", bucket_name = "buildwithai-assets" }
]
```

AI binding placeholder (depends on Cloudflare AI integration):

```toml
# ai = { binding = "AI" }
```

## 5) Secrets
Add secrets via the Wrangler CLI. Examples:

```bash
npx wrangler secret put OPENPROVIDER_API_KEY
npx wrangler secret put ALCHEMY_API_KEY
npx wrangler secret put INTERNAL_API_TOKEN
```

Run these from inside the `worker/` folder:

```bash
cd worker
npx wrangler secret put OPENPROVIDER_API_KEY
npx wrangler secret put ALCHEMY_API_KEY
npx wrangler secret put INTERNAL_API_TOKEN
```

## 6) Scripts
Package scripts have been removed from `worker/package.json` to avoid accidental Wrangler usage. Reintroduce scripts only when you have a finalized deployment plan.

## 7) Final notes
- Keep Worker files only inside `worker/` to avoid confusing Cloudflare Pages.
- The `worker/.gitignore` contains `node_modules/` and `dist/` to prevent accidental check-ins.
- After adding bindings and secrets, deploy with `npx wrangler deploy`.

## 8) Adding a custom domain route for the Worker (bind to API hostname)

To route requests from `api.buildwithai.digital/*` to this Worker, add a Trigger/Route in the Cloudflare dashboard:

1. Open Cloudflare Dashboard → Workers.
2. Select the Worker (or create a new one) and go to **Triggers** → **Add route**.
3. Enter the route: `api.buildwithai.digital/*` and save.

Alternatively, you can configure routes via the Cloudflare API or Terraform. Ensure the DNS for `api.buildwithai.digital` points to Cloudflare (proxied) and the Pages site remains separate.

CLI-compatible note (API token required):

You can also manage Worker routes via the Cloudflare API. This requires an API token with `workers:edit` and `zones:read` scopes and calls to the Routes/Workers endpoints. Dashboard is recommended for simplicity.

## 9) Troubleshooting

- If Pages still runs Wrangler, ensure the repository root contains only the static `index.html` and `.gitignore`, and that Cloudflare Pages Project Settings → Build & Deploy has an empty Build command and output directory `/`.
- If `wrangler dev` fails, run `npx wrangler --version` and re-authenticate with `npx wrangler login`.

## 10) Create Cloudflare resources (CLI)

Run these to create the resources; save returned IDs and paste them into `worker/wrangler.toml` under the commented binding sections.

```bash
# Create KV namespace
npx wrangler kv:namespace create BUILDWITHAI_CACHE

# Create D1 database
npx wrangler d1 create buildwithai

# Create R2 bucket
npx wrangler r2 bucket create buildwithai-assets
```

## 11) Safe authentication for automation (do NOT use Global API Key)

Use a scoped API Token with appropriate permissions (Workers: Edit, KV: Edit, D1: Edit, R2: Edit, Pages: Write if needed).

Authenticate locally (interactive):

```bash
npx wrangler login
```

If the login callback fails (local redirect issues), use no-localhost mode:

```bash
npx wrangler login --no-localhost
```

For CI/CD, configure Wrangler with an API token:

```bash
npx wrangler config
# When prompted, paste your API token
```

## 12) Final verification commands

Test locally and tail logs:

```bash
cd worker
npx wrangler dev

# Deploy
npx wrangler deploy

# Tail logs
npx wrangler tail

## 13) Local API routes (new)

The Worker exposes these routes under the Worker hostname / route you configure:

- GET /
  - Response: `{ "message": "BUILD WITH AI API is live" }`
  - Example:
    ```bash
    curl -s https://<YOUR_WORKER_HOST>/
    ```

- GET /health
  - Response: `{ "status": "ok" }`
  - Example:
    ```bash
    curl -s https://<YOUR_WORKER_HOST>/health
    ```

- GET /version
  - Response: `{ "version": "1.0.0", "timestamp": "..." }`
  - Example:
    ```bash
    curl -s https://<YOUR_WORKER_HOST>/version
    ```

Run the Worker locally and test these routes:

```bash
cd worker
npx wrangler dev
# then request the displayed local URL (http://127.0.0.1:8787 or similar)
```

```


