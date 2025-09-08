# Lavina Trucking - Network-Adaptive Deployment
# This script rebuilds the application for the current network environment

param(
    [switch]$Force = $false
)

Write-Host "Lavina Trucking - Network-Adaptive Deployment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

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

# Get current IP
$currentIP = Get-LocalIPAddress
if (-not $currentIP) {
    Write-Host "Could not detect current network IP address." -ForegroundColor Red
    Write-Host "Please ensure you're connected to a network." -ForegroundColor Yellow
    exit 1
}

Write-Host "Current Network IP: $currentIP" -ForegroundColor Yellow

# Check if containers are already running with this IP
$envFile = ".\.env"
$needsRebuild = $true

if (Test-Path $envFile -and -not $Force) {
    $currentConfig = Get-Content $envFile | Where-Object { $_ -match "FRONTEND_API_URL=" }
    if ($currentConfig -and $currentConfig -match "http://${currentIP}:8000/api") {
        Write-Host "✅ Application already configured for current network." -ForegroundColor Green
        
        # Check if containers are running
        $runningContainers = docker-compose ps --services --filter "status=running" 2>$null
        if ($runningContainers -and $runningContainers.Count -ge 3) {
            Write-Host "✅ Containers are already running." -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 Application Ready!" -ForegroundColor Green
            Write-Host "Access your application at: http://${currentIP}:3000" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Use -Force to rebuild anyway." -ForegroundColor Gray
            exit 0
        }
    }
}

Write-Host "🔧 Configuring application for current network..." -ForegroundColor Blue

# Update configurations
$frontendApiUrl = "http://${currentIP}:8000/api"

# Update backend .env.docker
$envDockerPath = ".\backend\.env.docker"
if (Test-Path $envDockerPath) {
    $content = Get-Content $envDockerPath
    $content = $content -replace "APP_URL=.*", "APP_URL=http://${currentIP}:8000"
    $content | Set-Content $envDockerPath
    Write-Host "✅ Backend configuration updated" -ForegroundColor Green
}

# Update docker-compose .env file
if (Test-Path $envFile) {
    $content = Get-Content $envFile
    $content = $content -replace "FRONTEND_API_URL=.*", "FRONTEND_API_URL=$frontendApiUrl"
    $content | Set-Content $envFile
} else {
    "FRONTEND_API_URL=$frontendApiUrl" | Set-Content $envFile
}
$env:FRONTEND_API_URL = $frontendApiUrl
Write-Host "✅ Frontend configuration updated" -ForegroundColor Green

# Stop existing containers
Write-Host "⏹️  Stopping existing containers..." -ForegroundColor Blue
docker-compose down 2>$null

# Rebuild and start
Write-Host "🏗️  Building application for network: $currentIP" -ForegroundColor Blue
Write-Host "    This may take a few minutes..." -ForegroundColor Gray

docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Application deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready for Testing!" -ForegroundColor Green
    Write-Host "===================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access from any device on this network:" -ForegroundColor White
    Write-Host "   Frontend: http://${currentIP}:3000" -ForegroundColor Cyan
    Write-Host "   Backend:  http://${currentIP}:8000/api" -ForegroundColor Cyan
    Write-Host "   Admin:    http://${currentIP}:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Tip: Bookmark the frontend URL for easy access!" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed. Check error messages above." -ForegroundColor Red
    exit 1
}
