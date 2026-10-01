$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "DayShelf V0 fix pack" -ForegroundColor Cyan

if (Test-Path "app\(auth)") {
    Remove-Item "app\(auth)" -Recurse -Force
    Write-Host "Removed duplicate app/(auth) routes." -ForegroundColor Green
}

if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
    Write-Host "Removed stale .next build artifacts." -ForegroundColor Green
}

Write-Host "Files from this fix pack should be copied into the project root before running this script." -ForegroundColor Yellow
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "  npm run db:generate"
Write-Host "  npm run build"
