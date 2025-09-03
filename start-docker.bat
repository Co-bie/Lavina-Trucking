@echo off
echo 🚛 Starting Lavina Trucking Application...
echo ================================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Build and start the application
echo 🔨 Building and starting containers...
docker-compose up --build -d

echo.
echo 🎉 Application is starting up!
echo ================================================
echo 📱 Frontend:     http://localhost:3000
echo 🔧 Backend API:  http://localhost:8000
echo 🗄️  Database UI:  http://localhost:8080
echo ================================================
echo.
echo ⏳ Please wait 30-60 seconds for all services to be ready...
echo 📝 Default login: admin@lavina.com / admin123
echo.
echo To stop the application: docker-compose down
echo To view logs: docker-compose logs
pause
