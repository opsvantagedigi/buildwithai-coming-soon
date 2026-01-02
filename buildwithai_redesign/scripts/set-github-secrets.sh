#!/usr/bin/env bash
set -euo pipefail

# Usage:
# VERCEL_TOKEN=xxx VERCEL_ORG_ID=yyy VERCEL_PROJECT_ID=zzz ./scripts/set-github-secrets.sh
# or export the env vars and run ./scripts/set-github-secrets.sh

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install GitHub CLI first: https://cli.github.com/"
  exit 1
fi

if [[ -z "${VERCEL_TOKEN:-}" || -z "${VERCEL_ORG_ID:-}" || -z "${VERCEL_PROJECT_ID:-}" ]]; then
  echo "Please set VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID environment variables."
  exit 1
fi

echo "Setting repository secrets..."
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID"

echo "Secrets set. Confirm in GitHub repository Settings → Secrets and variables → Actions."
