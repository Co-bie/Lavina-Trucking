@echo off
echo 🛠️ Troubleshooting Docker Setup...
echo =====================================

echo ⏹️ Stopping current containers...
docker-compose down

echo 🧹 Cleaning up Docker cache...
docker system prune -f

echo 🔨 Rebuilding containers with no cache...
docker-compose build --no-cache

echo 🚀 Starting services with health checks...
docker-compose up -d

echo.
echo ✅ Containers restarted with fixes!
echo.
echo 📊 Checking status in 10 seconds...
timeout /t 10 /nobreak > nul

echo.
echo === Container Status ===
docker-compose ps

echo.
echo === Backend Logs (last 20 lines) ===
docker-compose logs --tail=20 backend

echo.
echo === Database Logs (last 10 lines) ===
docker-compose logs --tail=10 database

echo.
echo 💡 If database issues persist:
echo    1. Check Docker Desktop is running
echo    2. Try: docker-compose down -v (removes volumes)
echo    3. Then: docker-compose up --build
pause
