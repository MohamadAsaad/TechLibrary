param(
    [string]$Branch = "gh-pages",
    [switch]$SkipPush
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Building the project..."
npm run build

if (-not (Test-Path "dist/index.html")) {
    throw "Build failed: dist/index.html was not created."
}

Copy-Item "dist/index.html" "dist/404.html" -Force

Write-Host "Preparing deployment files..."
git add dist -f

$hasStagedChanges = git diff --cached --name-only
if ($hasStagedChanges) {
    git commit -m "Deploy"
} else {
    Write-Host "No deployment changes to commit."
}

if (-not $SkipPush) {
    Write-Host "Publishing to GitHub Pages..."
    git subtree push --prefix dist origin $Branch
}
