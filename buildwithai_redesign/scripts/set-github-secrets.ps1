param(
  [Parameter(Mandatory=$false)] [string] $VERCEL_TOKEN = $env:VERCEL_TOKEN,
  [Parameter(Mandatory=$false)] [string] $VERCEL_ORG_ID = $env:VERCEL_ORG_ID,
  [Parameter(Mandatory=$false)] [string] $VERCEL_PROJECT_ID = $env:VERCEL_PROJECT_ID
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "gh CLI not found. Install GitHub CLI: https://cli.github.com/"
    exit 1
}

if (-not $VERCEL_TOKEN -or -not $VERCEL_ORG_ID -or -not $VERCEL_PROJECT_ID) {
    Write-Host "Provide secrets via parameters or environment variables. Example:"
    Write-Host ".\\\scripts\set-github-secrets.ps1 -VERCEL_TOKEN <token> -VERCEL_ORG_ID <org> -VERCEL_PROJECT_ID <proj>"
    exit 1
}

gh secret set VERCEL_TOKEN --body $VERCEL_TOKEN
gh secret set VERCEL_ORG_ID --body $VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID --body $VERCEL_PROJECT_ID

Write-Host "Secrets set. Verify in GitHub repository Settings → Secrets and variables → Actions."
