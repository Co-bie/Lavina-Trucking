$body = @{
    name = "testuser"
    first_name = "Test"
    last_name = "User"
    email = "test123@example.com"
    password = "password123"
    password_confirmation = "password123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/register" -Method POST -Body $body -Headers $headers
    Write-Host "Registration successful:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody"
    }
}
