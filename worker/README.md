# buildwithai-worker

This folder contains a minimal Cloudflare Worker scaffold for local development and deployment with Wrangler.

Quick commands
- Authenticate Wrangler (one-time):
  - `npx wrangler login`
- Run locally:
  - `npx wrangler dev --local` or `npm run dev`
- Deploy:
  - `npx wrangler deploy` or `npm run deploy`

Binding examples (edit `wrangler.toml` and uncomment/fill IDs):

- KV namespace example:
```
kv_namespaces = [
  { binding = "MY_KV", id = "xxxx" }
]
```

- D1 database example:
```
[[d1_databases]]
binding = "MY_DB"
database_name = "my_database"
database_id = "xxxx"
```

- R2 example:
```
r2_buckets = [
  { binding = "MY_BUCKET", bucket_name = "my-bucket" }
]
```

- AI binding placeholder (depends on Cloudflare AI integration):
```
# ai = { binding = "AI" }
```

Secrets
- Add secrets with:
```
npx wrangler secret put MY_SECRET
```

Notes
- This scaffold is intentionally placed in `worker/` so the repository root can remain a static Pages site.
- Before deploying, set `account_id` in `wrangler.toml` or use `--account-id` on the CLI.
