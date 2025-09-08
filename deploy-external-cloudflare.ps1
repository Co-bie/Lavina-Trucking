# Lavina Trucking - Cloudflare Tunnel Deployment
# Free permanent URLs for external network testing

param(
    [string]$TunnelName = "lavina-trucking",
    [string]$Domain = ""
)

Write-Host "☁️  Lavina Trucking - Cloudflare Tunnel Setup" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if cloudflared is installed
$cloudflaredPath = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflaredPath) {
    Write-Host "❌ cloudflared is not installed" -ForegroundColor Red
    Write-Host "Download from: https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Yellow
    Write-Host "After installation run: cloudflared tunnel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ cloudflared found" -ForegroundColor Green

if (-not $Domain) {
    Write-Host "⚠️  No domain specified. You'll need to configure DNS manually." -ForegroundColor Yellow
    $Domain = "your-domain.com"
}

# Create tunnel configuration
$configContent = @"
tunnel: $TunnelName
credentials-file: C:\Users\$env:USERNAME\.cloudflared\$TunnelName.json

ingress:
  - hostname: lavina-app.$Domain
    service: http://localhost:3000
  - hostname: lavina-api.$Domain
    service: http://localhost:8000
  - service: http_status:404
"@

$configPath = "C:\Users\$env:USERNAME\.cloudflared\config.yml"
$configContent | Out-File -FilePath $configPath -Encoding UTF8

Write-Host "✅ Configuration created at: $configPath" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Setup Instructions:" -ForegroundColor Yellow
Write-Host "1. Login to Cloudflare: cloudflared tunnel login" -ForegroundColor White
Write-Host "2. Create tunnel: cloudflared tunnel create $TunnelName" -ForegroundColor White
Write-Host "3. Add DNS records:" -ForegroundColor White
Write-Host "   - lavina-app.$Domain → $TunnelName.cfargotunnel.com" -ForegroundColor Cyan
Write-Host "   - lavina-api.$Domain → $TunnelName.cfargotunnel.com" -ForegroundColor Cyan
Write-Host "4. Run this script again to start the tunnel" -ForegroundColor White
Write-Host ""
Write-Host "🚀 To start tunnel: cloudflared tunnel run $TunnelName" -ForegroundColor Green
Write-Host "🌍 Access URLs:" -ForegroundColor Green
Write-Host "   - Frontend: https://lavina-app.$Domain" -ForegroundColor Cyan
Write-Host "   - Backend:  https://lavina-api.$Domain/api" -ForegroundColor Cyan

Write-Host ""
Write-Host "Would you like to start the tunnel now? (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -eq "Y" -or $response -eq "y") {
    Write-Host "🚀 Starting services and tunnel..." -ForegroundColor Blue
    
    # Start Laravel backend
    Write-Host "📡 Starting Laravel backend..." -ForegroundColor Blue
    Start-Job -ScriptBlock {
        Set-Location "C:\Users\Admin\Documents\GitHub\Lavina-Trucking\backend"
        php artisan serve --host=0.0.0.0 --port=8000
    }
    
    Start-Sleep -Seconds 5
    
    # Start React frontend
    Write-Host "📡 Starting React frontend..." -ForegroundColor Blue
    Start-Job -ScriptBlock {
        Set-Location "C:\Users\Admin\Documents\GitHub\Lavina-Trucking\frontend"
        npm run dev -- --host 0.0.0.0 --port 3000
    }
    
    Start-Sleep -Seconds 10
    
    # Start tunnel
    Write-Host "☁️  Starting Cloudflare tunnel..." -ForegroundColor Blue
    Write-Host "🌍 Your app will be available at:" -ForegroundColor Green
    Write-Host "   - https://lavina-app.$Domain" -ForegroundColor Cyan
    Write-Host "   - https://lavina-api.$Domain/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the tunnel" -ForegroundColor Yellow
    
    cloudflared tunnel run $TunnelName
}
