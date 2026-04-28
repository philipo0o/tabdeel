#!/bin/bash
# VPS Deployment Script for Tabdeel Backend
# Run this on your VPS after uploading your code

set -e  # Exit on any error

echo "🚀 Starting Tabdeel deployment..."

# 1. Update system
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# 2. Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# 3. Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# 4. Check .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file from .env.production template"
    echo "cp .env.production .env"
    echo "Then edit .env with your values"
    exit 1
fi

# 5. Update nginx config with domain
DOMAIN=$(grep DOMAIN .env | cut -d '=' -f2)
if [ -n "$DOMAIN" ]; then
    echo "🌐 Configuring Nginx for domain: $DOMAIN"
    sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf
fi

# 6. Build and start containers (without SSL first)
echo "🏗️ Building Docker containers..."
docker-compose -f docker-compose.prod.yml up -d --build postgres nest-app frontend

# 7. Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# 8. Check if services are running
echo "🔍 Checking services..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Point your domain DNS to this VPS IP: $(curl -s ifconfig.me)"
echo "2. Wait for DNS propagation (up to 24 hours)"
echo "3. Run SSL setup: ./setup-ssl.sh"
echo ""
echo "🌐 Your services:"
echo "   Frontend: http://$(curl -s ifconfig.me):3000"
echo "   Backend:  http://$(curl -s ifconfig.me):3001"
echo ""
