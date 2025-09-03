# Lavina Trucking - Docker Setup

A comprehensive trucking management system with user management, built with Laravel (backend) and React + TypeScript (frontend).

## 🚀 Quick Start with Docker

### Prerequisites
**You need to install Docker Desktop first - see installation guide below** ⬇️

### Docker Installation Guide

#### 🪟 **Windows Installation**
1. **Download Docker Desktop**:
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Choose your Windows version (Windows 10/11)

2. **Install Docker Desktop**:
   - Run the downloaded installer
   - Follow the installation wizard
   - **Important**: Enable WSL 2 when prompted (recommended)
   - Restart your computer when installation completes

3. **Verify Installation**:
   ```cmd
   docker --version
   docker-compose --version
   ```

#### 🍎 **macOS Installation**
1. **Download Docker Desktop**:
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Mac"
   - Choose your Mac chip: Intel or Apple Silicon (M1/M2)

2. **Install Docker Desktop**:
   - Open the downloaded `.dmg` file
   - Drag Docker to Applications folder
   - Launch Docker from Applications
   - Grant permissions when prompted

3. **Verify Installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

#### 🐧 **Linux Installation (Ubuntu/Debian)**
1. **Update package index**:
   ```bash
   sudo apt-get update
   ```

2. **Install Docker Engine**:
   ```bash
   # Remove old versions
   sudo apt-get remove docker docker-engine docker.io containerd runc

   # Install dependencies
   sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

   # Add Docker's official GPG key
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   # Add Docker repository
   echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io
   ```

3. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Add user to docker group** (optional, to run without sudo):
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in for this to take effect
   ```

5. **Verify Installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

#### ✅ **Verify Docker is Working**
Test Docker installation on any OS:
```bash
docker run hello-world
```
You should see a "Hello from Docker!" message.

---

### Git Installation (if needed)
- **Windows**: Download from https://git-scm.com/download/win
- **macOS**: Install via Homebrew: `brew install git` or download from https://git-scm.com/download/mac
- **Linux**: `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

---

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Lavina-Trucking
```

### 2. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Access the Application
- **Frontend (React)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database Admin (phpMyAdmin)**: http://localhost:8080

### 4. Default Login Credentials
After the containers are running, you can create an admin user or use the seeded data:
- **Admin**: admin@lavina.com / admin123
- **Driver**: driver@lavina.com / driver123

## 🐳 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | React TypeScript application with Vite |
| backend | 8000 | Laravel PHP API |
| database | 3306 | MySQL 8.0 database |
| phpmyadmin | 8080 | Database management interface |

## 📁 Project Structure
```
Lavina-Trucking/
├── backend/                 # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── Dockerfile
├── frontend/                # React TypeScript app
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml       # Multi-container orchestration
└── README-DOCKER.md        # This file
```

## 🔧 Development Commands

### Starting Services
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up frontend
docker-compose up backend
docker-compose up database
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ this will delete database data)
docker-compose down -v
```

### Viewing Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### Backend Commands
```bash
# Access backend container shell
docker-compose exec backend bash

# Run Laravel commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan tinker
```

### Database Management
```bash
# Access MySQL directly
docker-compose exec database mysql -u lavina_user -p lavina_trucking

# Backup database
docker-compose exec database mysqldump -u lavina_user -p lavina_trucking > backup.sql

# Restore database
docker-compose exec -T database mysql -u lavina_user -p lavina_trucking < backup.sql
```

## 🔐 Environment Configuration

### Backend Environment
The backend uses environment variables defined in `docker-compose.yml`. Key variables:
- `DB_HOST=database` (container name)
- `DB_DATABASE=lavina_trucking`
- `APP_URL=http://localhost:8000`

### Frontend Environment
The frontend API URL is configured via environment variables:
- Development: `VITE_API_URL=http://127.0.0.1:8000/api`
- Production: `VITE_API_URL=http://localhost:8000/api`

## 🚨 Troubleshooting

### Port Conflicts
If you get port errors, make sure these ports are free:
- 3000 (frontend)
- 8000 (backend)
- 3306 (database)
- 8080 (phpMyAdmin)

### Database Connection Issues
1. Wait for the database to fully start (can take 30-60 seconds)
2. Check logs: `docker-compose logs database`
3. Restart services: `docker-compose restart`

### Backend Not Starting
1. Check if `.env` file exists in backend directory
2. Run: `docker-compose exec backend php artisan key:generate`
3. Run migrations: `docker-compose exec backend php artisan migrate`

### Frontend Build Issues
1. Clear Docker cache: `docker system prune -a`
2. Rebuild: `docker-compose build --no-cache frontend`

## 📦 Production Deployment

For production deployment:

1. **Update Environment Variables** in `docker-compose.yml`:
   ```yaml
   environment:
     APP_ENV: production
     APP_DEBUG: false
     APP_URL: https://your-domain.com
   ```

2. **Use a Reverse Proxy** (nginx, traefik) for SSL termination

3. **Backup Database** regularly:
   ```bash
   docker-compose exec database mysqldump -u lavina_user -p lavina_trucking > backup-$(date +%Y%m%d).sql
   ```

## 🔄 Updates and Maintenance

### Updating Code
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up --build
```

### Database Migrations
```bash
# Run new migrations
docker-compose exec backend php artisan migrate
```

### Clearing Cache
```bash
# Clear Laravel cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
```

## 🎯 Features Available

### Admin Users Can:
- ✅ Manage all users (create, edit, block, delete)
- ✅ View user statistics and activity
- ✅ Access admin dashboard with controls

### All Users Can:
- ✅ Login/Register with validation
- ✅ Navigate with proper browser back button support
- ✅ Responsive design for mobile and desktop

### Technical Features:
- ✅ Role-based access control (admin, driver, client)
- ✅ User blocking/activation system
- ✅ Secure authentication with Laravel Sanctum
- ✅ Modern React UI with Tailwind CSS
- ✅ Containerized for easy deployment

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. View container logs: `docker-compose logs [service-name]`
3. Restart services: `docker-compose restart`
4. For database issues, access phpMyAdmin at http://localhost:8080

---

Built with ❤️ using Laravel, React, TypeScript, and Docker
