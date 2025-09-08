# Simple Development Setup (No Docker Required)
# This script runs the application in development mode

Write-Host "Lavina Trucking - Simple Development Setup" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green

# Check if Node.js is installed
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node.js is not installed. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if PHP is installed
$php = Get-Command php -ErrorAction SilentlyContinue
if (-not $php) {
    Write-Host "PHP is not installed. Please install from https://www.php.net/downloads" -ForegroundColor Red
    exit 1
}

Write-Host "Starting backend server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "cd backend; php artisan serve --host=0.0.0.0 --port=8000" -WindowStyle Minimized

Write-Host "Starting frontend server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "cd frontend; npm run dev -- --host 0.0.0.0 --port 3000" -WindowStyle Minimized

Write-Host ""
Write-Host "Servers starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://YOUR_IP:8000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://YOUR_IP:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to stop servers..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop the servers (simplified approach)
Write-Host "Stopping servers..." -ForegroundColor Red
Stop-Process -Name "php" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
