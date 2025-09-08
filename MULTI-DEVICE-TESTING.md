# Multi-Device Testing Guide

This guide will help you deploy and test the Lavina Trucking application on different devices.

## Prerequisites

1. Docker and Docker Compose installed on your host machine
2. All devices on the same network (Wi-Fi or LAN)
3. Host machine firewall configured to allow traffic on ports 3000, 8000, and 8080

## Setup Instructions

### Step 1: Find Your Host Machine's IP Address

**On Windows:**
```powershell
ipconfig
```
Look for your IPv4 address (usually starts with 192.168.x.x or 10.x.x.x)

**On Mac/Linux:**
```bash
ifconfig
# or
ip addr show
```

### Step 2: Update Configuration

1. Open `backend/.env.docker` file
2. Replace `YOUR_IP_ADDRESS` with your actual IP address:
   ```
   APP_URL=http://192.168.1.100:8000  # Replace with your IP
   ```

### Step 3: Build and Deploy

1. Open PowerShell/Terminal in the project root directory
2. Stop any existing containers:
   ```powershell
   docker-compose down
   ```

3. Build and start the services:
   ```powershell
   docker-compose up --build -d
   ```

4. Wait for all services to start (about 2-3 minutes)

### Step 4: Verify Deployment

Check that all services are running:
```powershell
docker-compose ps
```

All services should show "Up" status.

### Step 5: Access from Different Devices

Replace `YOUR_IP_ADDRESS` with your host machine's IP address:

- **Frontend Application**: http://YOUR_IP_ADDRESS:3000
- **Backend API**: http://YOUR_IP_ADDRESS:8000/api
- **phpMyAdmin**: http://YOUR_IP_ADDRESS:8080

### Example URLs (if your IP is 192.168.1.100):
- Frontend: http://192.168.1.100:3000
- Backend: http://192.168.1.100:8000/api
- phpMyAdmin: http://192.168.1.100:8080

## Testing from Different Devices

### Mobile Devices (Phone/Tablet)
1. Connect to the same Wi-Fi network as your host machine
2. Open a web browser
3. Navigate to http://YOUR_IP_ADDRESS:3000
4. Test login, registration, and all features

### Other Computers
1. Ensure they're on the same network
2. Open a web browser
3. Navigate to http://YOUR_IP_ADDRESS:3000
4. Test full functionality

## Troubleshooting

### If you can't access from other devices:

1. **Check Windows Firewall:**
   - Open Windows Security → Firewall & network protection
   - Click "Allow an app through firewall"
   - Add Docker Desktop or allow ports 3000, 8000, 8080

2. **Check Router/Network:**
   - Ensure all devices are on the same network
   - Some guest networks may block device-to-device communication

3. **Verify Docker Services:**
   ```powershell
   docker-compose logs
   ```

4. **Check Port Availability:**
   ```powershell
   netstat -an | findstr "3000 8000 8080"
   ```

### Common Issues:

- **CORS Errors**: The configuration should handle this, but if you see CORS errors, check that the backend is accessible from your device
- **API Connection Issues**: Verify the backend URL in browser developer tools
- **Session Issues**: Clear browser cache/cookies if authentication doesn't work properly

## Quick Deployment Script

You can also use the provided `deploy-for-testing.ps1` script for easier deployment.

## Security Note

This configuration is optimized for local network testing. For production deployment, additional security measures should be implemented.
