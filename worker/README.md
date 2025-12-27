# buildwithai-worker

This folder contains a minimal Cloudflare Worker scaffold for local development and deployment with Wrangler. The Worker is intentionally isolated under `worker/` so the repository root can remain a static Cloudflare Pages site.

## 1) Authentication
Authenticate the Wrangler CLI (one-time):

```bash
npx wrangler login
```

## 2) Local development
Run the following from the repository root or inside the `worker/` folder:

```bash
cd worker
npm install
npm run dev
# or directly with wrangler:
npx wrangler dev
```

Notes:
- You can set a local `account_id` in `wrangler.toml` or pass `--account-id` to commands.
- `wrangler dev` serves the Worker locally for testing.

## 3) Deployment
Before deploying, set your Cloudflare `account_id` in `worker/wrangler.toml` (uncomment and fill the `account_id` field) or provide it via CLI.

Deploy with:

```bash
cd worker
npm run deploy
# or
npx wrangler deploy
```

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

## 6) Scripts
`worker/package.json` includes these scripts:

```json
"scripts": {
  "dev": "wrangler dev",
  "deploy": "wrangler deploy"
}
```

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

## 9) Troubleshooting

- If Pages still runs Wrangler, ensure the repository root contains only the static `index.html` and `.gitignore`, and that Cloudflare Pages Project Settings → Build & Deploy has an empty Build command and output directory `/`.
- If `wrangler dev` fails, run `npx wrangler --version` and re-authenticate with `npx wrangler login`.


