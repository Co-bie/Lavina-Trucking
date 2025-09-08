# Lavina Trucking - Multi-Device Testing Deployment Script
# This script prepares the application for testing on different devices

param(
    [string]$HostIP = ""
)

Write-Host "🚚 Lavina Trucking - Multi-Device Testing Setup" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Function to get the local IP address
function Get-LocalIPAddress {
    $networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
        $_.InterfaceAlias -notlike "*Loopback*" -and 
        $_.InterfaceAlias -notlike "*VMware*" -and 
        $_.InterfaceAlias -notlike "*VirtualBox*" -and
        $_.IPAddress -ne "127.0.0.1" -and
        $_.IPAddress -match "^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)"
    }
    
    if ($networkAdapters) {
        return $networkAdapters[0].IPAddress
    } else {
        return $null
    }
}

# Get or detect IP address
if (-not $HostIP) {
    $HostIP = Get-LocalIPAddress
    if (-not $HostIP) {
        Write-Host "❌ Could not automatically detect your IP address." -ForegroundColor Red
        Write-Host "Please run: ipconfig" -ForegroundColor Yellow
        Write-Host "Find your IPv4 address and run this script with:" -ForegroundColor Yellow
        Write-Host ".\deploy-for-testing.ps1 -HostIP YOUR_IP_ADDRESS" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "🔍 Detected Host IP Address: $HostIP" -ForegroundColor Yellow

# Validate IP address format
if ($HostIP -notmatch "^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$") {
    Write-Host "❌ Invalid IP address format: $HostIP" -ForegroundColor Red
    exit 1
}

# Update .env.docker file
Write-Host "⚙️  Updating backend configuration..." -ForegroundColor Blue
$envDockerPath = ".\backend\.env.docker"
if (Test-Path $envDockerPath) {
    $content = Get-Content $envDockerPath
    $content = $content -replace "APP_URL=.*", "APP_URL=http://${HostIP}:8000"
    $content | Set-Content $envDockerPath
    Write-Host "✅ Backend configuration updated" -ForegroundColor Green
} else {
    Write-Host "❌ .env.docker file not found at $envDockerPath" -ForegroundColor Red
    exit 1
}

# Update docker-compose .env file
Write-Host "⚙️  Updating frontend configuration..." -ForegroundColor Blue
$composeEnvPath = ".\.env"
$frontendApiUrl = "http://${HostIP}:8000/api"
if (Test-Path $composeEnvPath) {
    $content = Get-Content $composeEnvPath
    $content = $content -replace "FRONTEND_API_URL=.*", "FRONTEND_API_URL=$frontendApiUrl"
    $content | Set-Content $composeEnvPath
} else {
    "FRONTEND_API_URL=$frontendApiUrl" | Set-Content $composeEnvPath
}

# Set environment variable for current session
$env:FRONTEND_API_URL = $frontendApiUrl
Write-Host "✅ Frontend API URL set to: $frontendApiUrl" -ForegroundColor Green

# Stop existing containers
Write-Host "⏹️  Stopping existing containers..." -ForegroundColor Blue
docker-compose down 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Existing containers stopped" -ForegroundColor Green
} else {
    Write-Host "⚠️  No existing containers to stop" -ForegroundColor Yellow
}

# Build and start containers
Write-Host "🏗️  Building and starting containers (this may take a few minutes)..." -ForegroundColor Blue
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Containers started successfully" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "======================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access your application from any device on the network:" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 Frontend Application:  http://${HostIP}:3000" -ForegroundColor Cyan
    Write-Host "🔗 Backend API:          http://${HostIP}:8000/api" -ForegroundColor Cyan
    Write-Host "🗄️  phpMyAdmin:          http://${HostIP}:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Testing Instructions:" -ForegroundColor Yellow
    Write-Host "1. Connect your test devices to the same Wi-Fi network" -ForegroundColor White
    Write-Host "2. Open a web browser on the device" -ForegroundColor White
    Write-Host "3. Navigate to: http://${HostIP}:3000" -ForegroundColor White
    Write-Host "4. Test login, registration, and all features" -ForegroundColor White
    Write-Host ""
    Write-Host "🛠️  Troubleshooting:" -ForegroundColor Yellow
    Write-Host "- If you can't access from other devices, check Windows Firewall settings" -ForegroundColor White
    Write-Host "- Ensure all devices are on the same network" -ForegroundColor White
    Write-Host "- Run 'docker-compose logs' to check for any errors" -ForegroundColor White
    
    # Check container status
    Write-Host ""
    Write-Host "📊 Container Status:" -ForegroundColor Yellow
    docker-compose ps
    
} else {
    Write-Host "❌ Failed to start containers. Check the error messages above." -ForegroundColor Red
    Write-Host "Run 'docker-compose logs' for more details." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
