#!/bin/bash

echo "🚛 Starting Lavina Trucking Application..."
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose is available"

# Build and start the application
echo "🔨 Building and starting containers..."
docker-compose up --build -d

echo ""
echo "🎉 Application is starting up!"
echo "================================================"
echo "📱 Frontend:     http://localhost:3000"
echo "🔧 Backend API:  http://localhost:8000"
echo "🗄️  Database UI:  http://localhost:8080"
echo "================================================"
echo ""
echo "⏳ Please wait 30-60 seconds for all services to be ready..."
echo "📝 Default login: admin@lavina.com / admin123"
echo ""
echo "To stop the application: docker-compose down"
echo "To view logs: docker-compose logs"
