# VPS Deployment Guide

## Prerequisites
- Hostinger VPS (Ubuntu 20.04/22.04)
- Domain name pointing to VPS IP
- SSH access to VPS

---

## Step 1: Connect to Your VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## Step 2: Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# On VPS
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git /var/www/tabdeel
cd /var/www/tabdeel/tabdeel-backend
```

**Option B: Using SCP (from your local machine)**
```bash
# From your local machine
scp -r C:\Users\paziz2\Documents\tabdeel root@YOUR_VPS_IP:/var/www/tabdeel
```

**Option C: Using Hostinger File Manager**
1. Login to Hostinger hPanel
2. Go to File Manager
3. Upload your project as a ZIP
4. Extract it

---

## Step 3: Configure Environment

```bash
cd /var/www/tabdeel/tabdeel-backend

# Copy production env template
cp .env.production .env

# Edit with your values
nano .env
```

Update these values in `.env`:
```env
DB_PASSWORD=your_strong_password_here
JWT_SECRET=your_very_long_random_secret_here
DOMAIN=your-domain.com
SSL_EMAIL=your-email@example.com
```

---

## Step 4: Update Nginx Config

```bash
# Replace YOUR_DOMAIN with your actual domain
sed -i 's/YOUR_DOMAIN/your-domain.com/g' nginx/nginx.conf
```

---

## Step 5: Run Deployment Script

```bash
# Make scripts executable
chmod +x deploy.sh setup-ssl.sh

# Run deployment
./deploy.sh
```

This will:
- Install Docker & Docker Compose
- Build all containers
- Start PostgreSQL, Backend, Frontend

---

## Step 6: Setup SSL (After DNS Propagation)

Wait for your domain DNS to point to your VPS, then:

```bash
./setup-ssl.sh
```

---

## Step 7: Verify Everything Works

```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# Check backend logs
docker logs biking_club_backend

# Check frontend logs
docker logs biking_club_frontend

# Test backend API
curl http://localhost:3001/api/users

# Test frontend
curl http://localhost:3000
```

---

## Useful Commands

### View logs:
```bash
docker logs biking_club_backend -f
docker logs biking_club_frontend -f
docker logs biking_club_postgres -f
```

### Restart services:
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Stop everything:
```bash
docker-compose -f docker-compose.prod.yml down
```

### Update and redeploy:
```bash
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

### Access database:
```bash
docker exec -it biking_club_postgres psql -U postgres -d biking_club
```

---

## Architecture on VPS

```
Internet
    ↓
Nginx (port 80/443)
    ├── / → Frontend (Next.js, port 3002)
    └── /api/ → Backend (NestJS, port 3001)
                    ↓
              PostgreSQL (port 5432)
```

---

## Troubleshooting

### Container won't start:
```bash
docker logs biking_club_backend
```

### Database connection error:
```bash
# Check postgres is healthy
docker inspect biking_club_postgres | grep Health
```

### Port already in use:
```bash
# Find what's using the port
lsof -i :3001
# Kill it
kill -9 PID
```

### Out of disk space:
```bash
# Clean unused Docker images
docker system prune -a
```
