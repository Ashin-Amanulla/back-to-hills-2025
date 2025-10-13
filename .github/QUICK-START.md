# CI/CD Quick Start Guide

This is a condensed quick-start guide for setting up GitHub Actions CI/CD with self-hosted runner on AWS EC2.

## Prerequisites Checklist

- [ ] AWS EC2 instance running (Ubuntu 22.04 LTS, t3.medium minimum)
- [ ] EC2 Security Group configured (ports 22, 80, 443, 5454)
- [ ] Domain name pointed to EC2 public IP (optional but recommended)
- [ ] SSH access to EC2 instance

---

## Quick Setup Commands

### 1. Initial Server Setup (Run on EC2)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
pm2 startup systemd
# Copy and run the command PM2 outputs

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Git (if not installed)
sudo apt install -y git

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5454/tcp
sudo ufw enable
```

### 2. Install GitHub Self-Hosted Runner

```bash
# Create runner directory
mkdir actions-runner && cd actions-runner

# Download runner (check for latest version at https://github.com/actions/runner/releases)
curl -o actions-runner-linux-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.319.1.tar.gz

# Configure (get token from GitHub: Settings → Actions → Runners → New runner)
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN

# Install as service
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

### 3. Configure Backend Nginx Reverse Proxy

```bash
# Create config file
sudo nano /etc/nginx/sites-available/btth
```

Paste this configuration (replace `api.yourdomain.com` with your domain/IP):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5454;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/btth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Configure Frontend Nginx

```bash
# Create web directory
sudo mkdir -p /var/www/back-to-hills-frontend
sudo chown -R ubuntu:ubuntu /var/www/back-to-hills-frontend

# Create config file
sudo nano /etc/nginx/sites-available/btth
```

Paste this configuration (replace `yourdomain.com` with your domain/IP):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/back-to-hills-frontend;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate for frontend
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Get SSL certificate for backend
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 6. Configure GitHub Secrets

Go to: GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

**Backend Secrets:**

```
BACKEND_PORT=5454
MONGODB_URI=mongodb://localhost:27017/back-to-hills
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**Frontend Secrets:**

```
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Back to Hills 2025
```

---

## Testing Your Setup

### 1. Test GitHub Runner

```bash
# On EC2
cd ~/actions-runner
sudo ./svc.sh status
```

You should see "Active: active (running)"

### 2. Test Manual Backend Deployment

```bash
# Clone your repo (first time only)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git ~/test-deploy
cd ~/test-deploy/backend

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5454
MONGODB_URI=mongodb://localhost:27017/back-to-hills
JWT_SECRET=your-secret-key
EOF

# Install and start
npm install --production
pm2 start app.js --name test-backend
pm2 list
pm2 logs test-backend

# Clean up after test
pm2 delete test-backend
```

### 3. Test Frontend Build

```bash
cd ~/test-deploy/frontend

# Create .env
echo "VITE_API_URL=https://api.yourdomain.com" > .env

# Build
npm install
npm run build

# Check build output
ls -la dist/
```

### 4. Trigger GitHub Actions

```bash
# Make a small change and push
cd ~/test-deploy
git checkout -b test-deployment
echo "# Test" >> README.md
git add .
git commit -m "Test CI/CD pipeline"
git push origin test-deployment
```

Check GitHub Actions tab in your repository to see the workflow running.

---

## Common Commands

### PM2 Management

```bash
pm2 list                              # List all processes
pm2 logs back-to-hills-backend        # View logs
pm2 restart back-to-hills-backend     # Restart app
pm2 stop back-to-hills-backend        # Stop app
pm2 delete back-to-hills-backend      # Remove app
pm2 monit                             # Monitor resources
pm2 save                              # Save process list
```

### Nginx Management

```bash
sudo systemctl status nginx           # Check status
sudo systemctl reload nginx           # Reload config
sudo systemctl restart nginx          # Restart Nginx
sudo nginx -t                         # Test config
sudo tail -f /var/log/nginx/error.log # View error logs
sudo tail -f /var/log/nginx/access.log # View access logs
```

### GitHub Runner Management

```bash
cd ~/actions-runner
sudo ./svc.sh status                  # Check status
sudo ./svc.sh start                   # Start runner
sudo ./svc.sh stop                    # Stop runner
sudo ./svc.sh restart                 # Restart runner
```

### System Monitoring

```bash
df -h                                 # Disk usage
free -h                               # Memory usage
top                                   # CPU usage
htop                                  # Better top (install: sudo apt install htop)
netstat -tlnp                         # Network connections
pm2 monit                             # PM2 monitoring
```

---

## Deployment Flow

1. **Developer pushes code** to `main` branch
2. **GitHub Actions triggers** the workflow
3. **Self-hosted runner** on EC2 picks up the job
4. **Backend workflow**:
   - Installs dependencies
   - Creates `.env` with secrets
   - Stops old PM2 process
   - Starts new PM2 process
5. **Frontend workflow**:
   - Installs dependencies
   - Builds production bundle
   - Copies to Nginx directory
   - Reloads Nginx

---

## Troubleshooting Quick Fixes

### Runner not connecting

```bash
cd ~/actions-runner
sudo ./svc.sh restart
```

### Backend not starting

```bash
pm2 logs back-to-hills-backend
pm2 restart back-to-hills-backend
```

### Frontend not loading

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
ls -la /var/www/back-to-hills-frontend
```

### Permission issues

```bash
# Fix frontend permissions
sudo chown -R www-data:www-data /var/www/back-to-hills-frontend

# Fix runner permissions
sudo chown -R ubuntu:ubuntu ~/actions-runner
```

---

## Important Notes

1. **Workflow runs on `main` branch only** - Push to `main` to trigger deployment
2. **Workflows watch specific paths** - Only changes to `backend/` or `frontend/` trigger respective workflows
3. **PM2 saves state** - Processes restart automatically on server reboot
4. **Nginx config changes** require reload: `sudo systemctl reload nginx`
5. **SSL certificates auto-renew** - Certbot handles this automatically

---

## Next Steps

1. Set up MongoDB (local or Atlas)
2. Configure domain DNS records
3. Set up SSL certificates
4. Configure email service (Gmail/SendGrid)
5. Set up monitoring (optional)
6. Configure backups (optional)

---

## Security Reminders

- ✅ Never commit `.env` files
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Keep GitHub secrets secure
- ✅ Regularly update system packages
- ✅ Enable firewall (UFW)
- ✅ Use SSH keys instead of passwords
- ✅ Keep SSL certificates updated

---

For detailed information, see [CICD-SETUP.md](./CICD-SETUP.md)
