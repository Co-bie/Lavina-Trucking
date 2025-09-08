# Test script for enhanced login error handling

Write-Host "Testing Enhanced Login Error Handling..." -ForegroundColor Green

# Test 1: Login with non-existent email
Write-Host "`n1. Testing login with non-existent email" -ForegroundColor Yellow
$loginData1 = @{
    email = "nonexistent@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $loginData1 -ContentType "application/json"
    Write-Host "Unexpected success: $($response.Content)" -ForegroundColor Red
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorContent = $reader.ReadToEnd()
    Write-Host "Error Response: $errorContent" -ForegroundColor Cyan
}

# Test 2: Login with existing email but wrong password
Write-Host "`n2. Testing login with wrong password" -ForegroundColor Yellow
$loginData2 = @{
    email = "admin@lavina-trucking.com"
    password = "wrongpassword123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $loginData2 -ContentType "application/json"
    Write-Host "Unexpected success: $($response.Content)" -ForegroundColor Red
} catch {
    $errorResponse = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($errorResponse)
    $errorContent = $reader.ReadToEnd()
    Write-Host "Error Response: $errorContent" -ForegroundColor Cyan
}

# Test 3: Create a test user, block them, then try to login
Write-Host "`n3. Testing login with blocked user" -ForegroundColor Yellow

# First create a user to block
$userData = @{
    first_name = "Blocked"
    last_name = "TestUser"
    email = "blocked.test@example.com"
    password = "password123"
    user_type = "client"
} | ConvertTo-Json

try {
    $createResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users" -Method POST -Body $userData -ContentType "application/json"
    $createdUser = $createResponse.Content | ConvertFrom-Json
    $userId = $createdUser.data.id
    Write-Host "Created test user with ID: $userId" -ForegroundColor Green
    
    # Block the user
    $blockResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users/$userId/toggle-status" -Method PATCH
    Write-Host "Blocked user successfully" -ForegroundColor Green
    
    # Try to login with blocked user
    $blockedLoginData = @{
        email = "blocked.test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/login" -Method POST -Body $blockedLoginData -ContentType "application/json"
        Write-Host "Unexpected success: $($loginResponse.Content)" -ForegroundColor Red
    } catch {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Blocked user error: $errorContent" -ForegroundColor Cyan
    }
    
    # Clean up - delete the test user
    $deleteResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/admin/users/$userId" -Method DELETE
    Write-Host "Cleaned up test user" -ForegroundColor Green
    
} catch {
    Write-Host "Error in blocked user test: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nLogin error handling tests completed!" -ForegroundColor Green
