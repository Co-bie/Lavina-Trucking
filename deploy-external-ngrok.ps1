# Lavina Trucking - External Network Testing with ngrok
# This script sets up ngrok tunnels for testing from different networks

param(
    [string]$NgrokAuthToken = "",
    [switch]$UseDocker = $false
)

Write-Host "🌐 Lavina Trucking - External Network Testing Setup" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Check if ngrok is installed
$ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokPath) {
    Write-Host "❌ ngrok is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please download and install ngrok from: https://ngrok.com/" -ForegroundColor Yellow
    Write-Host "After installation, run: ngrok authtoken YOUR_TOKEN" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ ngrok found at: $($ngrokPath.Source)" -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Function to start service and wait for it to be ready
function Start-ServiceAndWait {
    param(
        [string]$ServiceName,
        [int]$Port,
        [scriptblock]$StartCommand
    )
    
    Write-Host "🚀 Starting $ServiceName on port $Port..." -ForegroundColor Blue
    
    if (Test-Port -Port $Port) {
        Write-Host "✅ $ServiceName already running on port $Port" -ForegroundColor Green
        return $true
    }
    
    # Start the service in background
    $job = Start-Job -ScriptBlock $StartCommand
    
    # Wait for service to be ready (max 60 seconds)
    $timeout = 60
    $elapsed = 0
    while ($elapsed -lt $timeout) {
        Start-Sleep -Seconds 2
        $elapsed += 2
        
        if (Test-Port -Port $Port) {
            Write-Host "✅ $ServiceName is ready on port $Port" -ForegroundColor Green
            return $job
        }
        
        Write-Host "⏳ Waiting for $ServiceName to start... ($elapsed/$timeout seconds)" -ForegroundColor Yellow
    }
    
    Write-Host "❌ $ServiceName failed to start within $timeout seconds" -ForegroundColor Red
    return $false
}

if ($UseDocker) {
    Write-Host "🐳 Using Docker deployment..." -ForegroundColor Blue
    
    # Stop existing containers
    Write-Host "⏹️  Stopping existing containers..." -ForegroundColor Blue
    docker-compose down 2>$null
    
    # Start with Docker
    Write-Host "🏗️  Starting Docker containers..." -ForegroundColor Blue
    docker-compose up -d
    
    # Wait for containers to be ready
    Start-Sleep -Seconds 30
    
    $backendPort = 8000
    $frontendPort = 3000
    
} else {
    Write-Host "💻 Using local development servers..." -ForegroundColor Blue
    
    # Start Laravel backend
    $backendJob = Start-ServiceAndWait -ServiceName "Laravel Backend" -Port 8000 -StartCommand {
        Set-Location "C:\Users\Admin\Documents\GitHub\Lavina-Trucking\backend"
        php artisan serve --host=0.0.0.0 --port=8000
    }
    
    if ($backendJob -eq $false) {
        Write-Host "❌ Failed to start backend. Exiting." -ForegroundColor Red
        exit 1
    }
    
    # Start React frontend
    $frontendJob = Start-ServiceAndWait -ServiceName "React Frontend" -Port 3000 -StartCommand {
        Set-Location "C:\Users\Admin\Documents\GitHub\Lavina-Trucking\frontend"
        npm run dev -- --host 0.0.0.0 --port 3000
    }
    
    if ($frontendJob -eq $false) {
        Write-Host "❌ Failed to start frontend. Exiting." -ForegroundColor Red
        if ($backendJob -and $backendJob.GetType().Name -eq "PSRemotingJob") {
            Stop-Job $backendJob
            Remove-Job $backendJob
        }
        exit 1
    }
    
    $backendPort = 8000
    $frontendPort = 3000
}

Write-Host ""
Write-Host "🌐 Creating ngrok tunnels..." -ForegroundColor Blue

# Start ngrok for backend
Write-Host "📡 Creating backend tunnel..." -ForegroundColor Yellow
$backendTunnelJob = Start-Job -ScriptBlock {
    ngrok http 8000 --log=stdout
}

Start-Sleep -Seconds 3

# Start ngrok for frontend  
Write-Host "📡 Creating frontend tunnel..." -ForegroundColor Yellow
$frontendTunnelJob = Start-Job -ScriptBlock {
    ngrok http 3000 --log=stdout
}

Start-Sleep -Seconds 5

# Get ngrok URLs
Write-Host "🔍 Retrieving tunnel URLs..." -ForegroundColor Blue

try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get
    
    $backendTunnel = $ngrokApi.tunnels | Where-Object { $_.config.addr -eq "http://localhost:8000" } | Select-Object -First 1
    $frontendTunnel = $ngrokApi.tunnels | Where-Object { $_.config.addr -eq "http://localhost:3000" } | Select-Object -First 1
    
    if ($backendTunnel -and $frontendTunnel) {
        $backendUrl = $backendTunnel.public_url
        $frontendUrl = $frontendTunnel.public_url
        
        # Update frontend environment to use ngrok backend URL
        if (-not $UseDocker) {
            Write-Host "⚙️  Updating frontend configuration..." -ForegroundColor Blue
            $envFile = "C:\Users\Admin\Documents\GitHub\Lavina-Trucking\frontend\.env.local"
            "VITE_API_URL=$backendUrl/api" | Out-File -FilePath $envFile -Encoding UTF8
            Write-Host "✅ Frontend configured to use: $backendUrl/api" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "🎉 External Network Access Ready!" -ForegroundColor Green
        Write-Host "=================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌍 Access from ANY network/device:" -ForegroundColor White
        Write-Host ""
        Write-Host "📱 Frontend Application: $frontendUrl" -ForegroundColor Cyan
        Write-Host "🔗 Backend API:         $backendUrl/api" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 Testing Instructions:" -ForegroundColor Yellow
        Write-Host "1. Open ANY device with internet access" -ForegroundColor White
        Write-Host "2. Navigate to: $frontendUrl" -ForegroundColor White
        Write-Host "3. Test from cellular data, different WiFi, etc." -ForegroundColor White
        Write-Host ""
        Write-Host "⚠️  Security Note:" -ForegroundColor Red
        Write-Host "These URLs are publicly accessible on the internet." -ForegroundColor White
        Write-Host "Only use for testing - not for production data!" -ForegroundColor White
        Write-Host ""
        Write-Host "🛑 To stop tunnels: Press Ctrl+C" -ForegroundColor Yellow
        Write-Host ""
        
        # Wait for user input to keep tunnels alive
        Write-Host "Press any key to stop all services and tunnels..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
    } else {
        Write-Host "❌ Failed to retrieve tunnel URLs" -ForegroundColor Red
        Write-Host "Check ngrok status at: http://localhost:4040" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error connecting to ngrok API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check ngrok status manually at: http://localhost:4040" -ForegroundColor Yellow
}

# Cleanup
Write-Host ""
Write-Host "🧹 Cleaning up..." -ForegroundColor Blue

if ($backendTunnelJob) { Stop-Job $backendTunnelJob; Remove-Job $backendTunnelJob }
if ($frontendTunnelJob) { Stop-Job $frontendTunnelJob; Remove-Job $frontendTunnelJob }

if (-not $UseDocker) {
    if ($backendJob -and $backendJob.GetType().Name -eq "PSRemotingJob") { 
        Stop-Job $backendJob; Remove-Job $backendJob 
    }
    if ($frontendJob -and $frontendJob.GetType().Name -eq "PSRemotingJob") { 
        Stop-Job $frontendJob; Remove-Job $frontendJob 
    }
} else {
    Write-Host "🐳 Stopping Docker containers..." -ForegroundColor Blue
    docker-compose down
}

Write-Host "✅ Cleanup complete" -ForegroundColor Green
