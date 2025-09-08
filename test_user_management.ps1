# Test script for User Management API

Write-Host "Testing User Management API..." -ForegroundColor Green

# Test 1: Get Users
Write-Host "`n1. Testing GET /admin/users" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response preview: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))..."
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create User
Write-Host "`n2. Testing POST /admin/users" -ForegroundColor Yellow
$userData = @{
    first_name = "Test"
    last_name = "User"
    email = "test.user@example.com"
    password = "password123"
    user_type = "client"
    phone = "123-456-7890"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`nTest completed!" -ForegroundColor Green
