# Deploying Next.js Frontend to Hostinger

## Overview

Hostinger supports Node.js applications, so you can deploy your Next.js app directly. Here's how:

## Prerequisites

- ✅ Hostinger account with hosting plan
- ✅ Domain name configured
- ✅ SSH access enabled (Business/Cloud hosting)
- ✅ Node.js support (check your hosting plan)

## Deployment Options

### Option 1: Static Export (Recommended for Hostinger Shared Hosting)

This converts your Next.js app to static HTML files that work on any hosting.

### Option 2: Node.js Deployment (For VPS/Cloud Hosting)

Full Next.js with server-side rendering.

---

## Option 1: Static Export (Easiest)

### Step 1: Configure Next.js for Static Export

1. **Open `next.config.js` in your frontend folder**

2. **Update it to:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

### Step 2: Update Environment Variables

1. **Create `.env.production` file:**

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

Replace `your-domain.com` with your actual domain.

### Step 3: Build Your Frontend

Open terminal in frontend folder and run:

```bash
npm run build
```

This creates an `out` folder with static files.

### Step 4: Upload to Hostinger

**Method A: Using File Manager (Easiest)**

1. **Login to Hostinger hPanel**
2. **Go to File Manager**
3. **Navigate to `public_html` folder**
4. **Delete default files** (index.html, etc.)
5. **Upload all files from the `out` folder**
   - Select all files in `out` folder
   - Upload to `public_html`
6. **Done!** Visit your domain

**Method B: Using FTP**

1. **Get FTP credentials from Hostinger:**
   - hPanel → FTP Accounts
   - Create or use existing account

2. **Use FileZilla or any FTP client:**
   - Host: ftp.your-domain.com
   - Username: your-ftp-username
   - Password: your-ftp-password
   - Port: 21

3. **Upload `out` folder contents to `public_html`**

### Step 5: Configure .htaccess (Important!)

Create `.htaccess` file in `public_html`:

```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Option 2: Node.js Deployment (VPS/Cloud)

### Step 1: Check Node.js Support

1. **Login to Hostinger hPanel**
2. **Check if you have:**
   - SSH access
   - Node.js selector/manager
   - PM2 or process manager

### Step 2: Connect via SSH

```bash
ssh username@your-domain.com
```

### Step 3: Upload Your Code

**Method A: Using Git (Recommended)**

```bash
cd public_html
git clone https://github.com/your-username/your-repo.git .
```

**Method B: Using FTP**
- Upload entire frontend folder via FTP

### Step 4: Install Dependencies

```bash
cd public_html
npm install
```

### Step 5: Build for Production

```bash
npm run build
```

### Step 6: Start with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start your app
pm2 start npm --name "tabdeel-frontend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on reboot
pm2 startup
```

### Step 7: Configure Reverse Proxy

Create `.htaccess` in `public_html`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

## Post-Deployment Configuration

### 1. Update API URL

Make sure your frontend points to the correct backend:

**If backend is also on Hostinger:**
```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

**If backend is local/different server:**
```env
NEXT_PUBLIC_API_URL=http://your-backend-ip:3001/api
```

### 2. SSL Certificate

1. **In Hostinger hPanel:**
2. **Go to SSL**
3. **Install Free SSL (Let's Encrypt)**
4. **Enable HTTPS redirect**

### 3. Test Your Deployment

Visit your domain and check:
- ✅ Homepage loads
- ✅ Images display correctly
- ✅ Navigation works
- ✅ Language switching works
- ✅ All pages accessible

---

## Troubleshooting

### Issue: 404 errors on page refresh

**Solution:** Add this to `.htaccess`:
```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### Issue: Images not loading

**Solution:** Check `next.config.js` has:
```javascript
images: {
  unoptimized: true,
}
```

### Issue: API calls failing

**Solution:** 
1. Check CORS is enabled on backend
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check if backend is accessible from frontend

### Issue: Slow loading

**Solution:**
1. Enable compression in `.htaccess`
2. Enable browser caching
3. Optimize images before upload
4. Use CDN for static assets

---

## Updating Your Site

### For Static Export:

1. Make changes locally
2. Run `npm run build`
3. Upload new `out` folder contents
4. Clear browser cache

### For Node.js Deployment:

```bash
# SSH into server
ssh username@your-domain.com

# Pull latest changes
cd public_html
git pull

# Install new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart tabdeel-frontend
```

---

## Performance Optimization

### 1. Enable Gzip Compression

Already included in `.htaccess` above.

### 2. Optimize Images

Before uploading:
```bash
# Install image optimizer
npm install -g sharp-cli

# Optimize images
sharp -i public/image.png -o public/image-optimized.png
```

### 3. Use CDN

Consider using Cloudflare (free) for:
- CDN
- DDoS protection
- SSL
- Caching

### 4. Minify Assets

Next.js does this automatically during build.

---

## Monitoring

### Check if site is up:
```bash
curl -I https://your-domain.com
```

### Check Node.js process (if using PM2):
```bash
pm2 status
pm2 logs tabdeel-frontend
```

### Monitor traffic:
- Use Hostinger's built-in analytics
- Add Google Analytics
- Use Cloudflare analytics

---

## Security Best Practices

1. **Always use HTTPS**
2. **Keep dependencies updated:** `npm audit fix`
3. **Don't commit `.env` files**
4. **Use strong passwords**
5. **Enable Hostinger's security features**
6. **Regular backups**

---

## Quick Deployment Checklist

- [ ] Build frontend: `npm run build`
- [ ] Upload to Hostinger
- [ ] Configure `.htaccess`
- [ ] Install SSL certificate
- [ ] Update API URL
- [ ] Test all pages
- [ ] Enable HTTPS redirect
- [ ] Set up monitoring
- [ ] Create backup

---

## Need Help?

- Hostinger Support: https://www.hostinger.com/support
- Next.js Docs: https://nextjs.org/docs/deployment
- Community: Hostinger Community Forum

---

**Your frontend is ready to go live! 🚀**
