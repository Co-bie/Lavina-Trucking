# Extended test script for User Management API

Write-Host "Testing Additional User Management Operations..." -ForegroundColor Green

# Test 3: Update User
Write-Host "`n3. Testing PUT /admin/users/3" -ForegroundColor Yellow
$updateData = @{
    first_name = "Updated"
    last_name = "TestUser"
    phone = "555-123-4567"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users/3" -Method PUT -Body $updateData -ContentType "application/json"
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Toggle User Status (Block/Unblock)
Write-Host "`n4. Testing PATCH /admin/users/3/toggle-status" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users/3/toggle-status" -Method Patch
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Toggle User Status Again (to reactivate)
Write-Host "`n5. Testing PATCH /admin/users/3/toggle-status (reactivate)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users/3/toggle-status" -Method Patch
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nUser Management API tests completed!" -ForegroundColor Green
