#!/bin/bash

# Lavina Trucking - Network-Adaptive Deployment for macOS/Linux
# This script rebuilds the application for the current network environment

set -e

FORCE=false
if [[ "$1" == "--force" || "$1" == "-f" ]]; then
    FORCE=true
fi

echo "🚛 Lavina Trucking - Network-Adaptive Deployment (macOS/Linux)"
echo "=============================================================="

# Function to get the local IP address
get_local_ip() {
    # Try different methods to get local IP
    local ip
    
    # Method 1: Using route command (works on most Unix systems)
    ip=$(route get default 2>/dev/null | grep interface | awk '{print $2}' | head -1 | xargs ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1)
    
    # Method 2: Using ifconfig directly (fallback)
    if [[ -z "$ip" ]]; then
        ip=$(ifconfig 2>/dev/null | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | grep -E '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)' | head -1)
    fi
    
    # Method 3: Using hostname command (another fallback)
    if [[ -z "$ip" ]]; then
        ip=$(hostname -I 2>/dev/null | awk '{print $1}')
    fi
    
    echo "$ip"
}

# Get current IP
CURRENT_IP=$(get_local_ip)
if [[ -z "$CURRENT_IP" ]]; then
    echo "❌ Could not detect current network IP address."
    echo "💡 Please ensure you're connected to a network."
    exit 1
fi

echo "🌐 Current Network IP: $CURRENT_IP"

# Check if containers are already running with this IP
ENV_FILE=".env"
NEEDS_REBUILD=true

if [[ -f "$ENV_FILE" && "$FORCE" != true ]]; then
    if grep -q "FRONTEND_API_URL=http://${CURRENT_IP}:8000/api" "$ENV_FILE" 2>/dev/null; then
        echo "✅ Application already configured for current network."
        
        # Check if containers are running
        if docker-compose ps | grep -q "Up"; then
            echo "✅ Containers are already running."
            echo ""
            echo "🎯 Access Points:"
            echo "   Frontend: http://${CURRENT_IP}:3000"
            echo "   Backend:  http://${CURRENT_IP}:8000/api"
            echo "   Admin:    http://${CURRENT_IP}:8080"
            echo ""
            echo "💡 Use --force flag to rebuild anyway"
            exit 0
        fi
    fi
fi

# Set frontend API URL
FRONTEND_API_URL="http://${CURRENT_IP}:8000/api"

# Update .env file
if [[ -f "$ENV_FILE" ]]; then
    # Update existing .env file
    if grep -q "FRONTEND_API_URL=" "$ENV_FILE"; then
        sed -i.bak "s|FRONTEND_API_URL=.*|FRONTEND_API_URL=$FRONTEND_API_URL|" "$ENV_FILE"
    else
        echo "FRONTEND_API_URL=$FRONTEND_API_URL" >> "$ENV_FILE"
    fi
else
    # Create new .env file
    echo "FRONTEND_API_URL=$FRONTEND_API_URL" > "$ENV_FILE"
fi

export FRONTEND_API_URL="$FRONTEND_API_URL"
echo "✅ Frontend configuration updated"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Stop existing containers
echo "⏹️  Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Rebuild and start
echo "🏗️  Building application for network: $CURRENT_IP"
echo "    This may take a few minutes..."

if docker-compose up --build -d; then
    echo ""
    echo "✅ Application deployed successfully!"
    echo ""
    echo "🎯 Ready for Testing!"
    echo "===================="
    echo ""
    echo "📱 Access from any device on this network:"
    echo "   Frontend: http://${CURRENT_IP}:3000"
    echo "   Backend:  http://${CURRENT_IP}:8000/api" 
    echo "   Admin:    http://${CURRENT_IP}:8080"
    echo ""
    echo "💡 Tip: Bookmark the frontend URL for easy access!"
    echo "📱 Share the frontend URL with others on the same network!"
else
    echo "❌ Deployment failed. Check error messages above."
    exit 1
fi