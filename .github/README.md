# CI/CD Setup for Back to Hills 2025

Complete CI/CD pipeline using GitHub Actions with self-hosted runners on AWS EC2.

## 📚 Documentation Overview

This directory contains comprehensive documentation for setting up and maintaining your CI/CD pipeline:

### 🚀 Getting Started

1. **[Quick Start Guide](QUICK-START.md)** ⭐ START HERE

   - Condensed setup guide with essential commands
   - Step-by-step installation instructions
   - Common commands reference
   - Perfect for experienced developers

2. **[Complete Setup Guide](CICD-SETUP.md)**

   - Detailed, comprehensive guide
   - In-depth explanations for each step
   - Troubleshooting section
   - Security best practices
   - Perfect for first-time setup

3. **[Deployment Checklist](DEPLOYMENT-CHECKLIST.md)**

   - Step-by-step checklist format
   - Nothing gets missed
   - Pre-deployment, deployment, and post-deployment tasks
   - Maintenance schedule
   - Perfect for ensuring complete setup

4. **[Architecture Overview](ARCHITECTURE.md)**
   - System architecture diagrams
   - Component breakdown
   - Traffic flow visualization
   - Scaling considerations
   - Perfect for understanding the big picture

### 📁 Configuration Files

#### Workflows

- [`workflows/backend.yml`](workflows/backend.yml) - Backend CI/CD workflow
- [`workflows/frontend.yml`](workflows/frontend.yml) - Frontend CI/CD workflow

#### Nginx Configurations

- [`nginx/backend-api.conf`](nginx/backend-api.conf) - Backend reverse proxy config
- [`nginx/frontend.conf`](nginx/frontend.conf) - Frontend web server config

#### Helper Scripts

- [`scripts/server-setup.sh`](scripts/server-setup.sh) - Automated server setup
- [`scripts/deploy-backend.sh`](scripts/deploy-backend.sh) - Manual backend deployment
- [`scripts/deploy-frontend.sh`](scripts/deploy-frontend.sh) - Manual frontend deployment

---

## 🎯 Quick Reference

### What You Need

- ✅ AWS EC2 instance (Ubuntu 22.04, t3.medium minimum)
- ✅ Domain name (optional but recommended)
- ✅ GitHub repository
- ✅ 1-2 hours for initial setup

### What You Get

- ✅ Automated deployments on push to `main`
- ✅ Backend API with PM2 process management
- ✅ Frontend SPA served via Nginx
- ✅ SSL/HTTPS support
- ✅ Zero-downtime deployments
- ✅ Comprehensive logging and monitoring

---

## 📖 Quick Start (5 Steps)

### 1. Launch EC2 Instance

```bash
# Instance: Ubuntu 22.04 LTS, t3.medium
# Ports: 22, 80, 443, 5454
# Storage: 30GB SSD
```

### 2. Run Server Setup

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
curl -o setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/back-to-hills-2025/main/.github/scripts/server-setup.sh
chmod +x setup.sh
./setup.sh
```

### 3. Install GitHub Runner

```bash
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz
tar xzf ./actions-runner-linux-x64-2.319.1.tar.gz
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_TOKEN
sudo ./svc.sh install
sudo ./svc.sh start
```

### 4. Configure Nginx

```bash
# Copy and edit configurations
sudo cp .github/nginx/backend-api.conf /etc/nginx/sites-available/
sudo cp .github/nginx/frontend.conf /etc/nginx/sites-available/

# Update domain names in configs, then enable
sudo ln -s /etc/nginx/sites-available/backend-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Add GitHub Secrets

```bash
# Go to: GitHub Repo → Settings → Secrets → New secret
# Add all required secrets (see QUICK-START.md for list)
```

**Done!** Push to `main` branch to trigger your first deployment.

---

## 🔄 How It Works

```
Developer → Git Push (main) → GitHub Actions Triggered
                                      ↓
                              Self-Hosted Runner (EC2)
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
            Backend Workflow                    Frontend Workflow
                    ↓                                   ↓
            Install Dependencies                 Build Production
                    ↓                                   ↓
            Create .env                          Deploy to Nginx
                    ↓                                   ↓
            PM2 Restart                          Reload Nginx
                    ↓                                   ↓
                  Live!                              Live!
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────┐
│            AWS EC2 Instance                 │
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │   Backend    │      │   Frontend   │   │
│  │   (PM2)      │      │   (Nginx)    │   │
│  │ Port: 5454   │      │ Port: 80/443 │   │
│  └──────────────┘      └──────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │   GitHub Self-Hosted Runner         │  │
│  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 🛠 Common Commands

### PM2 Management

```bash
pm2 list                            # List all processes
pm2 logs back-to-hills-backend      # View logs
pm2 restart back-to-hills-backend   # Restart
pm2 monit                           # Monitor
```

### Nginx Management

```bash
sudo systemctl status nginx         # Status
sudo systemctl reload nginx         # Reload
sudo nginx -t                       # Test config
sudo tail -f /var/log/nginx/error.log  # Logs
```

### GitHub Runner

```bash
cd ~/actions-runner
sudo ./svc.sh status               # Status
sudo ./svc.sh restart              # Restart
```

---

## 🔐 Security Best Practices

- ✅ Use SSH keys only (disable password auth)
- ✅ Keep system packages updated
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Enable UFW firewall
- ✅ Use HTTPS/SSL certificates
- ✅ Never commit secrets to git
- ✅ Regular security audits
- ✅ Monitor logs for suspicious activity

---

## 🐛 Troubleshooting

### Backend Not Working

```bash
pm2 logs back-to-hills-backend     # Check logs
pm2 restart back-to-hills-backend  # Restart
```

### Frontend Not Loading

```bash
sudo nginx -t                       # Test config
sudo tail -f /var/log/nginx/error.log  # Check logs
ls -la /var/www/back-to-hills-frontend  # Verify files
```

### Runner Not Connecting

```bash
cd ~/actions-runner
sudo ./svc.sh status
sudo ./svc.sh restart
```

For detailed troubleshooting, see [CICD-SETUP.md](CICD-SETUP.md#troubleshooting).

---

## 📈 Monitoring

### Application Health

- PM2 Dashboard: `pm2 monit`
- Application Logs: `pm2 logs`
- Nginx Logs: `/var/log/nginx/`

### System Health

- Disk Usage: `df -h`
- Memory: `free -h`
- CPU: `htop`

---

## 🔄 Deployment Workflow

### Automatic Deployment

1. Make changes to code
2. Commit and push to `main` branch
3. GitHub Actions automatically deploys
4. Monitor deployment in Actions tab

### Manual Deployment

```bash
# Backend
cd .github/scripts
./deploy-backend.sh

# Frontend
./deploy-frontend.sh
```

---

## 📞 Support & Resources

### Documentation

- 📘 [Quick Start Guide](QUICK-START.md)
- 📗 [Complete Setup Guide](CICD-SETUP.md)
- 📙 [Deployment Checklist](DEPLOYMENT-CHECKLIST.md)
- 📕 [Architecture Overview](ARCHITECTURE.md)

### External Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Community

- Create an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via pull requests

---

## 🎓 Learning Path

**New to DevOps?** Follow this order:

1. Read [Architecture Overview](ARCHITECTURE.md) - Understand the system
2. Follow [Quick Start Guide](QUICK-START.md) - Set up the basics
3. Use [Deployment Checklist](DEPLOYMENT-CHECKLIST.md) - Ensure nothing is missed
4. Reference [Complete Setup Guide](CICD-SETUP.md) - Deep dive into details

**Experienced?** Jump straight to:

- [Quick Start Guide](QUICK-START.md) for rapid setup
- [Deployment Checklist](DEPLOYMENT-CHECKLIST.md) to verify everything

---

## 📝 Version History

- **v1.0** - Initial CI/CD setup with GitHub Actions
  - Backend deployment with PM2
  - Frontend deployment with Nginx
  - Self-hosted runner on EC2
  - SSL/HTTPS support
  - Comprehensive documentation

---

## 🤝 Contributing

Found an issue or have an improvement?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This CI/CD setup is part of the Back to Hills 2025 project.

---

## ✅ Pre-Flight Checklist

Before you start, ensure you have:

- [ ] AWS account with EC2 access
- [ ] GitHub account
- [ ] Basic understanding of Linux commands
- [ ] SSH client installed
- [ ] 1-2 hours of uninterrupted time
- [ ] Domain name (optional)
- [ ] Email service credentials (for backend)

---

**Ready to deploy?** Start with the [Quick Start Guide](QUICK-START.md)!

**Questions?** Check the [Complete Setup Guide](CICD-SETUP.md) for detailed explanations.

**Need a checklist?** Use the [Deployment Checklist](DEPLOYMENT-CHECKLIST.md).

---

_Last Updated: October 2025_
