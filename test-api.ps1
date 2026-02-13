Write-Host "🧪 Testing Nourishment Backend API" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "📍 Test 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET -ErrorAction Stop
    Write-Host "✓ Backend is running" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "✗ Backend is NOT running or health endpoint not available" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Login with ADMIN
Write-Host "📍 Test 2: Login as ADMIN" -ForegroundColor Yellow
try {
    $body = @{
        username = "ADMIN"
        password = "admin"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop

    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($response.token.Substring(0, 50))..." -ForegroundColor Cyan
    
    if ($response.user) {
        Write-Host "User: $($response.user | ConvertTo-Json)" -ForegroundColor Cyan
    }

    # Save token for next test
    $global:authToken = $response.token

} catch {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get meals with auth token
if ($global:authToken) {
    Write-Host "📍 Test 3: Get Meals (with auth)" -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $global:authToken"
        }

        $meals = Invoke-RestMethod -Uri "http://localhost:8080/api/meals" `
            -Method GET `
            -Headers $headers `
            -ErrorAction Stop

        Write-Host "✓ Meals fetched successfully!" -ForegroundColor Green
        Write-Host "Count: $($meals.Count)" -ForegroundColor Cyan
        
        if ($meals.Count -gt 0) {
            Write-Host "First meal: $($meals[0] | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
        }

    } catch {
        Write-Host "✗ Failed to fetch meals" -ForegroundColor Red
        Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🏁 Testing complete!" -ForegroundColor Cyan
