# Skrypt do restartu backendu z CORS dla localhost:3001

Write-Host "🔄 Restarting backend with updated CORS..." -ForegroundColor Cyan
Write-Host ""

# Kill existing backend process
Write-Host "📍 Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process -Name "go" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Set CORS environment variable and start backend
Write-Host "📍 Starting backend with CORS: http://localhost:3001" -ForegroundColor Yellow
cd C:\Repo\nourishment_20

$env:CORS_ALLOW_ORIGINS_LIST = "http://localhost:3001,http://localhost:3000,http://www.localhost:8080"

Write-Host "✓ CORS configured: $env:CORS_ALLOW_ORIGINS_LIST" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Starting Go backend on port 8080..." -ForegroundColor Yellow
Write-Host ""

go run cmd/nourishment/main.go
