$ErrorActionPreference = 'Stop'

Write-Host "Starting Laravel and Vite dev servers..." -ForegroundColor Green

$backend = Start-Process -FilePath php -ArgumentList "artisan serve" -WorkingDirectory "$PSScriptRoot\backend" -PassThru
$frontend = Start-Process -FilePath npm -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host "Backend PID: $($backend.Id) at http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend PID: $($frontend.Id) at http://localhost:5173" -ForegroundColor Cyan

Write-Host "Press Ctrl+C to stop both servers (closing this window won't stop them automatically)." -ForegroundColor Yellow

Wait-Process -Id @($backend.Id, $frontend.Id)

