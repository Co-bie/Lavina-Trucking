# 🍎 macOS Setup Guide for Lavina Trucking

## Prerequisites

1. **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com)
2. **GitHub Desktop** - Download from [desktop.github.com](https://desktop.github.com)
3. **Docker Desktop** - Download from [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop)

## Quick Setup Steps

### 1. Install Prerequisites
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop manually from docker.com
# Make sure Docker Desktop is running before proceeding
```

### 2. Clone the Repository
- Open GitHub Desktop
- Clone the `Lavina-Trucking` repository
- Or use terminal: `git clone https://github.com/Co-bie/Lavina-Trucking.git`

### 3. Deploy the Application
```bash
# Navigate to the project directory
cd Lavina-Trucking

# Make the script executable
chmod +x deploy-anywhere.sh

# Run the deployment
./deploy-anywhere.sh
```

### 4. Access the Application
After successful deployment, you'll see output like:
```
✅ Application deployed successfully!

📱 Access from any device on this network:
   Frontend: http://192.168.1.100:3000
   Backend:  http://192.168.1.100:8000/api
   Admin:    http://192.168.1.100:8080
```

## Alternative: Manual Setup (if Docker issues occur)

### Backend Setup
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port=3000
```

## Troubleshooting

### Docker Issues
- Make sure Docker Desktop is running
- Check Docker version: `docker --version`
- Restart Docker Desktop if needed

### Network Issues
- Use `--force` flag to rebuild: `./deploy-anywhere.sh --force`
- Check firewall settings
- Ensure devices are on the same network

### Permission Issues
```bash
# If permission denied:
chmod +x deploy-anywhere.sh
sudo ./deploy-anywhere.sh
```

## Testing from Other Devices

1. **Find your Mac's IP** (script will show this)
2. **Share the frontend URL** with other devices on the same WiFi
3. **Test booking system** from phones, tablets, other computers

## Features to Test

- ✅ Client login → redirects to booking page (no sidebar)
- ✅ Admin login → redirects to full dashboard (with sidebar)
- ✅ Truck selection in booking form
- ✅ Trip creation and management
- ✅ Cross-device compatibility