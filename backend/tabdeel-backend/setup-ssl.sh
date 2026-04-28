#!/bin/bash
# SSL Setup Script using Let's Encrypt
# Run this AFTER your domain DNS is pointing to your VPS

set -e

echo "🔒 Setting up SSL certificate..."

# Load domain from .env
DOMAIN=$(grep DOMAIN .env | cut -d '=' -f2)
SSL_EMAIL=$(grep SSL_EMAIL .env | cut -d '=' -f2)

if [ -z "$DOMAIN" ] || [ -z "$SSL_EMAIL" ]; then
    echo "❌ DOMAIN and SSL_EMAIL must be set in .env file"
    exit 1
fi

echo "Domain: $DOMAIN"
echo "Email: $SSL_EMAIL"

# Start nginx without SSL first (for certbot verification)
echo "🌐 Starting Nginx for domain verification..."

# Create temporary nginx config without SSL
cat > nginx/nginx-temp.conf << EOF
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            return 200 'OK';
        }
    }
}
EOF

# Start nginx with temp config
docker run -d --name temp-nginx \
    -p 80:80 \
    -v $(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro \
    -v $(pwd)/certbot_data:/var/www/certbot \
    nginx:alpine

# Get SSL certificate
echo "📜 Getting SSL certificate from Let's Encrypt..."
docker run --rm \
    -v $(pwd)/certbot_certs:/etc/letsencrypt \
    -v $(pwd)/certbot_data:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $SSL_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Stop temp nginx
docker stop temp-nginx && docker rm temp-nginx
rm nginx/nginx-temp.conf

# Start full stack with SSL
echo "🚀 Starting full stack with SSL..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ SSL setup complete!"
echo "🌐 Your site is now live at: https://$DOMAIN"
echo ""
echo "📋 SSL certificate will auto-renew every 90 days"
