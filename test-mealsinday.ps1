# Test MealsInDay API endpoint

Write-Host "Testing /mealsinday endpoint..." -ForegroundColor Cyan

# Try to get auth token from localStorage (if saved)
$token = ""
if (Test-Path "$env:USERPROFILE\.authToken") {
    $token = Get-Content "$env:USERPROFILE\.authToken" -Raw
    Write-Host "Found token: $($token.Substring(0, 20))..." -ForegroundColor Green
}

# Test GET /mealsinday
Write-Host "`nGET http://localhost:8080/mealsinday" -ForegroundColor Yellow

try {
    if ($token) {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/mealsinday" `
            -Method GET `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            } `
            -UseBasicParsing
    } else {
        Write-Host "No token found, trying without auth..." -ForegroundColor Yellow
        $response = Invoke-WebRequest -Uri "http://localhost:8080/mealsinday" `
            -Method GET `
            -Headers @{
                "Content-Type" = "application/json"
            } `
            -UseBasicParsing
    }
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan
