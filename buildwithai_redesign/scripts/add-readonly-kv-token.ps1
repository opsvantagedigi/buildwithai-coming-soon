<#
.SYNOPSIS
  Add Upstash KV read-only REST token to Vercel env (production + preview), redeploy, and verify KV health.

.DESCRIPTION
  - Reads the token from temporary environment variable `RO_TOKEN` (must be set before running).
  - Idempotent: removes existing `KV_REST_API_READ_ONLY_TOKEN` for each scope before adding the new value.
  - Does not print the token value.
  - Removes the temporary `RO_TOKEN` environment variable when finished.
  - Triggers a production redeploy and performs a final KV health check.

USAGE
  # Set RO_TOKEN in current PowerShell session (example):
  $env:RO_TOKEN = Read-Host -AsSecureString "Enter read-only token" | ConvertFrom-SecureString
  # Or set plain token in env (temporary):
  $env:RO_TOKEN = "your-token-here"
  .\scripts\add-readonly-kv-token.ps1

NOTE
  - Ensure you are logged in to Vercel CLI (`npx vercel login`) before running.
  - This script avoids echoing the token to the console.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Exec-Quiet {
    param(
        [string[]] $Command
    )
    # Invoke the command using PowerShell's native call operator to avoid
    # argument/quoting parsing issues. Capture combined output and exit code.
    $cmd = $Command[0]
    $args = @()
    if ($Command.Length -gt 1) { $args = $Command[1..($Command.Length - 1)] }
    $output = & $cmd @args 2>&1
    $exit = $LASTEXITCODE
    $text = $null
    if ($output) { $text = ($output -join "`n").Trim() }
    return @{ ExitCode = $exit; StdOut = $text; StdErr = '' }
}

# Validate RO_TOKEN exists (do NOT echo it)
if (-not $env:RO_TOKEN -or [string]::IsNullOrWhiteSpace($env:RO_TOKEN)) {
    Write-Error "Environment variable RO_TOKEN is not set. Set RO_TOKEN (temporary) before running this script."
    exit 2
}

$varName = 'KV_REST_API_READ_ONLY_TOKEN'
$scopes  = @('production','preview')

try {
    foreach ($scope in $scopes) {
        Write-Host "Processing scope: $scope" -ForegroundColor Cyan

        # List envs to check existence
        $check = Exec-Quiet @('npx','vercel','env','ls')
        if ($check.ExitCode -ne 0) {
            Write-Warning "Unable to list Vercel envs (exit $($check.ExitCode)). Proceeding to add the variable."
        }

        $exists = $false
        if ($check.StdOut) {
            $pattern = [regex]::Escape($varName) + '\s+' + [regex]::Escape($scope)
            if ($check.StdOut -match $pattern) { $exists = $true }
        }

        if ($exists) {
            Write-Host "Existing variable found for scope '$scope' — removing before re-adding (idempotent)." -ForegroundColor Yellow
            $rm = Exec-Quiet @('npx','vercel','env','rm',$varName,$scope,'--yes')
            if ($rm.ExitCode -ne 0) {
                Write-Warning "Failed to remove existing variable for scope '$scope'. Continuing to attempt to add (vercel exit $($rm.ExitCode))."
            } else {
                Write-Host "Removed existing variable for scope '$scope'." -ForegroundColor Green
            }
        } else {
            Write-Host "No existing variable found for scope '$scope'." -ForegroundColor DarkGray
        }

        # Add the env var using $env:RO_TOKEN (do not print the token)
        Write-Host "Adding $varName to Vercel ($scope)..." -NoNewline
        $add = Exec-Quiet @('npx','vercel','env','add',$varName,$scope,'--value',$env:RO_TOKEN)
        if ($add.ExitCode -ne 0) {
            Write-Warning ""
            Write-Warning "Failed to add $varName for scope '$scope' (exit $($add.ExitCode))."
            if ($add.StdErr) { Write-Warning "vercel stderr: $($add.StdErr -replace '\r|\n',' | ')" }
        } else {
            Write-Host " Done." -ForegroundColor Green
        }
    }

    # Remove temporary environment variable from this session
    try {
        Remove-Item Env:RO_TOKEN -ErrorAction SilentlyContinue
        Write-Host "Temporary environment variable RO_TOKEN removed from current session." -ForegroundColor DarkGray
    } catch {
        Write-Warning "Could not remove RO_TOKEN from environment: $_"
    }

    # Trigger production redeploy
    Write-Host "`nTriggering production redeploy..." -ForegroundColor Cyan
    $deploy = Exec-Quiet @('npx','vercel','--prod','--yes')
    if ($deploy.ExitCode -ne 0) {
        Write-Warning "Redeploy command failed (exit $($deploy.ExitCode))."
        if ($deploy.StdErr) { Write-Warning $deploy.StdErr }
        if ($deploy.StdOut)  { Write-Host $deploy.StdOut }
        throw "Redeploy failed."
    } else {
        Write-Host "Redeploy triggered successfully." -ForegroundColor Green
        if ($deploy.StdOut) {
            $lines = $deploy.StdOut -split "`n"
            $summary = $lines | Select-String -Pattern 'Production:|Aliased:|Inspect:' -SimpleMatch
            if ($summary) { $summary | ForEach-Object { Write-Host $_.Line } }
        }
    }

    Start-Sleep -Seconds 3

    # Final KV health check (non-sensitive)
    Write-Host "`nChecking KV health endpoint..." -ForegroundColor Cyan
    $curl = Exec-Quiet @('curl','-sS','https://buildwithai.digital/api/kv/health')
    if ($curl.ExitCode -ne 0) {
        Write-Warning "KV health check request failed (curl exit $($curl.ExitCode))."
        if ($curl.StdErr) { Write-Warning $curl.StdErr }
        exit 3
    } else {
        Write-Host "KV health response:" -ForegroundColor Green
        Write-Host $curl.StdOut
    }

} catch {
    Write-Error "An error occurred: $_"
    exit 1
}
