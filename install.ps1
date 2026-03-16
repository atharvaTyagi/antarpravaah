# Antar Pravaah — Install Script
# Run this script from the project root to set up all dependencies.
# Usage: .\install.ps1

Set-StrictMode -Off
$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host "`n>> $msg" -ForegroundColor Cyan
}

function Write-Ok($msg) {
    Write-Host "   [OK] $msg" -ForegroundColor Green
}

function Write-Warn($msg) {
    Write-Host "   [WARN] $msg" -ForegroundColor Yellow
}

function Write-Fail($msg) {
    Write-Host "   [FAIL] $msg" -ForegroundColor Red
}

# ── 1. Check Node.js ──────────────────────────────────────────────────────────
Write-Step "Checking Node.js..."
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Fail "Node.js is not installed or not on PATH."
    Write-Host "   Download it from https://nodejs.org (v18 or newer required)." -ForegroundColor Yellow
    exit 1
}

$nodeVersion = node --version   # e.g. "v20.11.0"
$nodeMajor   = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajor -lt 18) {
    Write-Fail "Node.js $nodeVersion detected. v18 or newer is required."
    exit 1
}
Write-Ok "Node.js $nodeVersion"

# ── 2. Check npm ──────────────────────────────────────────────────────────────
Write-Step "Checking npm..."
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Fail "npm is not available. Please reinstall Node.js."
    exit 1
}
$npmVersion = npm --version
Write-Ok "npm $npmVersion"

# ── 3. Install dependencies ───────────────────────────────────────────────────
Write-Step "Installing dependencies (npm install)..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Fail "npm install failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}
Write-Ok "All dependencies installed."

# ── 4. Environment variables setup ───────────────────────────────────────────
Write-Step "Checking environment variables..."
$envFile    = Join-Path $PSScriptRoot ".env.local"
$envExample = Join-Path $PSScriptRoot ".env.local.example"

if (Test-Path $envFile) {
    Write-Ok ".env.local already exists — skipping."
} elseif (Test-Path $envExample) {
    Copy-Item $envExample $envFile
    Write-Warn ".env.local was created from .env.local.example."
    Write-Host "   Fill in the real values before running the dev server." -ForegroundColor Yellow
} else {
    Write-Warn ".env.local not found. Create it manually with the variables listed in README.md."
}

# ── 5. Done ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Make sure .env.local is populated with real credentials (see README.md)."
Write-Host "  2. Run the dev server:  npm run dev"
Write-Host "  3. Open http://localhost:3000 in your browser."
Write-Host ""
