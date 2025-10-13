# CI/CD Setup Guide - GitHub Actions with Self-Hosted Runner on AWS EC2

This guide will help you set up a complete CI/CD pipeline for the Back to Hills 2025 project using GitHub Actions with self-hosted runners on AWS EC2.

## Table of Contents

1. [AWS EC2 Setup](#aws-ec2-setup)
2. [Server Configuration](#server-configuration)
3. [GitHub Self-Hosted Runner Setup](#github-self-hosted-runner-setup)
4. [Backend Deployment Configuration](#backend-deployment-configuration)
5. [Frontend Deployment Configuration](#frontend-deployment-configuration)
6. [GitHub Secrets Configuration](#github-secrets-configuration)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

---

## AWS EC2 Setup

### 1. Launch EC2 Instance

1. **Login to AWS Console** and navigate to EC2
2. **Launch Instance** with the following specifications:

   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t3.medium or higher (2 vCPU, 4GB RAM minimum)
   - **Storage**: 30GB gp3 SSD minimum
   - **Security Group**: Configure inbound rules:
     - SSH (22) - Your IP
     - HTTP (80) - 0.0.0.0/0
     - HTTPS (443) - 0.0.0.0/0
     - Custom TCP (5454) - Your IP or Security Group (Backend API)
     - MongoDB (27017) - Localhost only (if using local MongoDB)

3. **Create/Select Key Pair** and download the `.pem` file

4. **Note down**:
   - Public IPv4 address
   - Public IPv4 DNS
   - Instance ID

### 2. Connect to EC2 Instance

```bash
# Change permission of your key pair
chmod 400 your-key-pair.pem

# Connect to EC2
ssh -i your-key-pair.pem ubuntu@your-ec2-public-ip
```

---

## Server Configuration

### 1. Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js and npm

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Verify PM2
pm2 --version
```

### 4. Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 5. Install MongoDB (Optional - if not using MongoDB Atlas)

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Reload package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB
sudo systemctl status mongod
```

### 6. Configure Firewall

```bash
# Allow OpenSSH, Nginx, and custom backend port
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5454/tcp
sudo ufw enable

# Check firewall status
sudo ufw status
```

---

## GitHub Self-Hosted Runner Setup

### 1. Create Runner in GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Actions** → **Runners**
3. Click **New self-hosted runner**
4. Select **Linux** as the operating system
5. Follow the instructions provided (or use the commands below)

### 2. Install GitHub Runner on EC2

```bash
# Create a folder for the runner
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.319.1.tar.gz

# Configure the runner
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN

# When prompted:
# - Enter name: back-to-hills-runner
# - Enter labels: self-hosted,linux,x64,aws,ec2
# - Enter work folder: press Enter for default
```

### 3. Install Runner as a Service

```bash
# Install the service
sudo ./svc.sh install

# Start the service
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

### 4. Verify Runner

- Go back to GitHub → Settings → Actions → Runners
- You should see your runner with "Idle" status

---

## Backend Deployment Configuration

### 1. Create Application Directory

```bash
# Create directory for backend
sudo mkdir -p /home/ubuntu/apps/back-to-hills-backend
sudo chown -R ubuntu:ubuntu /home/ubuntu/apps
```

### 2. Configure PM2 Ecosystem (Optional)

```bash
# Create PM2 ecosystem file
cat > ~/apps/back-to-hills-backend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'back-to-hills-backend',
    script: './app.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF
```

### 3. Set up Nginx Reverse Proxy for Backend

```bash
# Create Nginx configuration for backend API
sudo nano /etc/nginx/sites-available/backend-api
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # Replace with your domain or EC2 public IP

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
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Frontend Deployment Configuration

### 1. Create Web Directory

```bash
# Create directory for frontend
sudo mkdir -p /var/www/back-to-hills-frontend
sudo chown -R ubuntu:ubuntu /var/www/back-to-hills-frontend
```

### 2. Configure Nginx for Frontend

```bash
# Create Nginx configuration for frontend
sudo nano /etc/nginx/sites-available/frontend
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Replace with your domain or EC2 public IP

    root /var/www/back-to-hills-frontend;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location block
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Disable logging for favicon and robots
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        log_not_found off;
        access_log off;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/

# Remove default Nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## GitHub Secrets Configuration

### Required Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

#### Backend Secrets

| Secret Name      | Description               | Example                                                          |
| ---------------- | ------------------------- | ---------------------------------------------------------------- |
| `BACKEND_PORT`   | Backend server port       | `5454`                                                           |
| `MONGODB_URI`    | MongoDB connection string | `mongodb://localhost:27017/back-to-hills` or `mongodb+srv://...` |
| `JWT_SECRET`     | JWT secret key            | `your-super-secret-jwt-key-min-32-chars`                         |
| `JWT_EXPIRES_IN` | JWT expiration time       | `7d`                                                             |
| `EMAIL_HOST`     | SMTP host                 | `smtp.gmail.com`                                                 |
| `EMAIL_PORT`     | SMTP port                 | `587`                                                            |
| `EMAIL_USER`     | SMTP username             | `your-email@gmail.com`                                           |
| `EMAIL_PASS`     | SMTP password             | `your-app-password`                                              |
| `EMAIL_FROM`     | From email address        | `noreply@yourdomain.com`                                         |
| `FRONTEND_URL`   | Frontend URL              | `http://yourdomain.com`                                          |

#### Frontend Secrets

| Secret Name     | Description      | Example                     |
| --------------- | ---------------- | --------------------------- |
| `VITE_API_URL`  | Backend API URL  | `http://api.yourdomain.com` |
| `VITE_APP_NAME` | Application name | `Back to Hills 2025`        |

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate for frontend
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Obtain SSL certificate for backend API
sudo certbot --nginx -d api.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### Update GitHub Secrets with HTTPS URLs

After SSL setup, update these secrets:

- `FRONTEND_URL` → `https://yourdomain.com`
- `VITE_API_URL` → `https://api.yourdomain.com`

---

## Monitoring and Maintenance

### PM2 Commands

```bash
# View all running processes
pm2 list

# View logs
pm2 logs back-to-hills-backend

# Monitor resources
pm2 monit

# Restart application
pm2 restart back-to-hills-backend

# Stop application
pm2 stop back-to-hills-backend

# View detailed info
pm2 info back-to-hills-backend
```

### Nginx Commands

```bash
# Check status
sudo systemctl status nginx

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### GitHub Runner Commands

```bash
cd ~/actions-runner

# Check status
sudo ./svc.sh status

# Stop runner
sudo ./svc.sh stop

# Start runner
sudo ./svc.sh start

# Restart runner
sudo ./svc.sh restart
```

### System Monitoring

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
htop  # Install: sudo apt install htop

# Check network connections
netstat -tlnp
```

---

## Troubleshooting

### Runner Not Connecting

```bash
# Check runner logs
cd ~/actions-runner
sudo journalctl -u actions.runner.* -f

# Restart runner service
sudo ./svc.sh restart
```

### Backend Deployment Fails

```bash
# Check PM2 logs
pm2 logs back-to-hills-backend --lines 100

# Check environment variables
pm2 env 0

# Restart backend
pm2 restart back-to-hills-backend
```

### Frontend Not Loading

```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify files exist
ls -la /var/www/back-to-hills-frontend

# Check permissions
ls -la /var/www/
```

### MongoDB Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod

# Test MongoDB connection
mongosh  # or mongo for older versions
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t
```

---

## Deployment Workflow

### How It Works

1. **Push to Repository**: Developer pushes code to `main` branch
2. **Trigger Workflow**: GitHub Actions workflow is triggered
3. **Self-Hosted Runner**: EC2 runner picks up the job
4. **Backend Workflow**:
   - Checkout code
   - Install dependencies
   - Run tests
   - Create `.env` file with secrets
   - Stop existing PM2 process
   - Start new PM2 process
   - Verify deployment
5. **Frontend Workflow**:
   - Checkout code
   - Install dependencies
   - Build production bundle
   - Deploy to Nginx directory
   - Reload Nginx
   - Verify deployment

### Manual Deployment

If you need to deploy manually:

#### Backend

```bash
cd ~/apps/back-to-hills-backend
git pull origin main
npm install --production
pm2 restart back-to-hills-backend
```

#### Frontend

```bash
cd ~/temp-build-frontend
git pull origin main
cd frontend
npm install
npm run build
sudo rm -rf /var/www/back-to-hills-frontend/*
sudo cp -r dist/* /var/www/back-to-hills-frontend/
sudo systemctl reload nginx
```

---

## Security Best Practices

1. **Keep System Updated**

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use Strong Passwords and SSH Keys**

   - Disable password authentication
   - Use SSH key-based authentication only

3. **Configure Firewall Properly**

   - Only allow necessary ports
   - Restrict SSH access to specific IPs

4. **Regular Backups**

   - Database backups
   - Application code backups
   - SSL certificate backups

5. **Monitor Logs Regularly**

   - Application logs
   - System logs
   - Security logs

6. **Use Environment Variables**

   - Never commit secrets to repository
   - Use GitHub Secrets for sensitive data

7. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Check PM2/Nginx/MongoDB logs
4. Consult the project documentation

---

**Last Updated**: October 2025
