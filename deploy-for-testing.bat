@echo off
echo 🚚 Lavina Trucking - Multi-Device Testing Setup
echo ================================================
echo.
echo This script will help you deploy the application for testing on different devices.
echo.
echo Please run the PowerShell version for a better experience:
echo   .\deploy-for-testing.ps1
echo.
echo Or manually:
echo 1. Find your IP address: ipconfig
echo 2. Update backend\.env.docker - change APP_URL to http://YOUR_IP:8000
echo 3. Update .env - change FRONTEND_API_URL to http://YOUR_IP:8000/api
echo 4. Run: docker-compose up --build -d
echo 5. Access from other devices: http://YOUR_IP:3000
echo.
pause
