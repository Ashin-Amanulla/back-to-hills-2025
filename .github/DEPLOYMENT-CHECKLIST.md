# Deployment Checklist

Use this checklist to ensure all steps are completed for successful CI/CD setup.

## Pre-Deployment Checklist

### AWS EC2 Setup

- [ ] EC2 instance launched (Ubuntu 22.04 LTS, t3.medium minimum)
- [ ] Security Group configured with required ports:
  - [ ] SSH (22) - Your IP
  - [ ] HTTP (80) - 0.0.0.0/0
  - [ ] HTTPS (443) - 0.0.0.0/0
  - [ ] Backend API (5454) - Localhost only
- [ ] Key pair downloaded and saved securely
- [ ] Public IP address noted
- [ ] Elastic IP assigned (optional but recommended)
- [ ] SSH access verified

### Domain & DNS (Optional but Recommended)

- [ ] Domain name purchased/available
- [ ] DNS A record for main domain → EC2 Public IP
- [ ] DNS A record for www subdomain → EC2 Public IP
- [ ] DNS A record for api subdomain → EC2 Public IP
- [ ] DNS propagation verified (can take 24-48 hours)

### Development Environment

- [ ] Code tested locally
- [ ] Git repository created
- [ ] Repository pushed to GitHub
- [ ] All dependencies listed in package.json

---

## Server Setup Checklist

### Initial Server Configuration

- [ ] Connected to EC2 via SSH
- [ ] System packages updated: `sudo apt update && sudo apt upgrade -y`
- [ ] Firewall (UFW) configured and enabled
- [ ] Timezone set correctly (optional): `sudo timedatectl set-timezone Asia/Kolkata`

### Software Installation

- [ ] Node.js 20.x installed
- [ ] npm verified working
- [ ] PM2 installed globally: `sudo npm install -g pm2`
- [ ] PM2 startup script configured
- [ ] Nginx installed and running
- [ ] Git installed
- [ ] Certbot installed (for SSL)
- [ ] MongoDB installed (if using local DB) OR MongoDB Atlas configured

### Directory Structure

- [ ] Application directory created: `~/apps/back-to-hills-backend`
- [ ] Web directory created: `/var/www/back-to-hills-frontend`
- [ ] Proper permissions set on directories
- [ ] Log directories created

---

## GitHub Runner Setup Checklist

### Runner Installation

- [ ] Runner directory created: `~/actions-runner`
- [ ] Latest runner package downloaded
- [ ] Runner configured with repository token
- [ ] Runner name set: `back-to-hills-runner`
- [ ] Custom labels added: `self-hosted,linux,x64,aws,ec2`
- [ ] Runner installed as systemd service
- [ ] Runner service started
- [ ] Runner status verified as "Idle" on GitHub

### Runner Verification

- [ ] Runner appears in GitHub Settings → Actions → Runners
- [ ] Runner status shows as "Idle" (green)
- [ ] Runner can execute jobs (test with a simple workflow)

---

## Nginx Configuration Checklist

### Backend API Configuration

- [ ] Config file created: `/etc/nginx/sites-available/backend-api`
- [ ] Server name updated with your domain/IP
- [ ] Proxy pass pointing to `localhost:5454`
- [ ] Symbolic link created in sites-enabled
- [ ] Nginx configuration tested: `sudo nginx -t`
- [ ] Nginx reloaded: `sudo systemctl reload nginx`
- [ ] Backend API accessible via domain/IP

### Frontend Configuration

- [ ] Config file created: `/etc/nginx/sites-available/frontend`
- [ ] Server name updated with your domain/IP
- [ ] Root directory set to `/var/www/back-to-hills-frontend`
- [ ] SPA routing configured (`try_files` directive)
- [ ] Gzip compression enabled
- [ ] Static asset caching configured
- [ ] Default site removed: `sudo rm /etc/nginx/sites-enabled/default`
- [ ] Symbolic link created in sites-enabled
- [ ] Nginx configuration tested: `sudo nginx -t`
- [ ] Nginx reloaded: `sudo systemctl reload nginx`

---

## GitHub Secrets Configuration Checklist

### Backend Secrets (Repository Secrets)

- [ ] `BACKEND_PORT` = `5454`
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `JWT_SECRET` = Strong random string (32+ characters)
- [ ] `JWT_EXPIRES_IN` = `7d` or preferred duration
- [ ] `EMAIL_HOST` = SMTP host (e.g., `smtp.gmail.com`)
- [ ] `EMAIL_PORT` = SMTP port (e.g., `587`)
- [ ] `EMAIL_USER` = Email address
- [ ] `EMAIL_PASS` = Email password/app password
- [ ] `EMAIL_FROM` = Sender email address
- [ ] `FRONTEND_URL` = Your frontend URL

### Frontend Secrets

- [ ] `VITE_API_URL` = Your backend API URL
- [ ] `VITE_APP_NAME` = `Back to Hills 2025` or your app name

### Verify Secrets

- [ ] All secrets added to GitHub repository
- [ ] Secret names match workflow files exactly
- [ ] No typos in secret values
- [ ] Secrets tested with a deployment

---

## Workflow Files Checklist

### Backend Workflow (.github/workflows/backend.yml)

- [ ] Workflow file exists and has correct syntax
- [ ] Triggers configured for `main` branch
- [ ] Path filters set for `backend/**`
- [ ] Test job configured
- [ ] Deploy job configured
- [ ] PM2 commands correct
- [ ] Environment variables mapped from secrets

### Frontend Workflow (.github/workflows/frontend.yml)

- [ ] Workflow file exists and has correct syntax
- [ ] Triggers configured for `main` branch
- [ ] Path filters set for `frontend/**`
- [ ] Build job configured
- [ ] Deploy job configured
- [ ] Nginx deployment directory correct
- [ ] Build artifacts upload/download configured

---

## SSL/HTTPS Setup Checklist (Recommended)

### Let's Encrypt SSL

- [ ] Certbot installed
- [ ] SSL certificate obtained for main domain
- [ ] SSL certificate obtained for API subdomain
- [ ] Nginx configurations updated with SSL
- [ ] Auto-renewal tested: `sudo certbot renew --dry-run`
- [ ] HTTP to HTTPS redirect enabled
- [ ] HSTS header added (after verifying SSL works)

### Post-SSL Updates

- [ ] `FRONTEND_URL` secret updated to `https://`
- [ ] `VITE_API_URL` secret updated to `https://`
- [ ] CORS settings updated in backend
- [ ] All HTTP references changed to HTTPS
- [ ] SSL certificate expiry monitoring set up

---

## Testing Checklist

### Backend Testing

- [ ] Backend starts successfully with PM2
- [ ] PM2 logs show no errors: `pm2 logs back-to-hills-backend`
- [ ] API accessible at configured URL
- [ ] Database connection successful
- [ ] Authentication endpoints working
- [ ] Email functionality tested
- [ ] Error handling working

### Frontend Testing

- [ ] Frontend builds without errors
- [ ] Static files deployed to Nginx directory
- [ ] Homepage loads correctly
- [ ] All routes working (SPA routing)
- [ ] API calls successful
- [ ] Images and assets loading
- [ ] Mobile responsiveness checked

### CI/CD Testing

- [ ] Push to `main` branch triggers workflow
- [ ] Backend workflow runs successfully
- [ ] Frontend workflow runs successfully
- [ ] Deployments complete without errors
- [ ] Applications update with new code
- [ ] Rollback procedure tested (optional)

---

## Post-Deployment Checklist

### Monitoring Setup

- [ ] PM2 monitoring configured: `pm2 monit`
- [ ] Log rotation configured
- [ ] Disk space monitoring set up
- [ ] Application error tracking configured
- [ ] Uptime monitoring configured (optional)

### Backup Strategy

- [ ] Database backup script created
- [ ] Backup schedule configured
- [ ] Backup verification tested
- [ ] Environment files backed up securely
- [ ] Nginx configs backed up
- [ ] SSL certificates backed up

### Documentation

- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Common issues and solutions documented
- [ ] Contact information for team members
- [ ] Emergency procedures documented

### Security Hardening

- [ ] Password authentication disabled (SSH keys only)
- [ ] Fail2ban installed (optional)
- [ ] Regular security updates scheduled
- [ ] Firewall rules reviewed
- [ ] Sensitive data encrypted
- [ ] Environment variables never committed to git

---

## Maintenance Checklist (Regular)

### Daily

- [ ] Check PM2 process status
- [ ] Review error logs
- [ ] Monitor disk usage

### Weekly

- [ ] Review Nginx logs
- [ ] Check GitHub Actions workflow runs
- [ ] Verify backups are running
- [ ] Review application performance

### Monthly

- [ ] Update system packages: `sudo apt update && sudo apt upgrade -y`
- [ ] Review and rotate logs
- [ ] Check SSL certificate expiry
- [ ] Update npm dependencies if needed
- [ ] Review security advisories

### Quarterly

- [ ] Full system audit
- [ ] Disaster recovery test
- [ ] Performance optimization review
- [ ] Cost analysis and optimization

---

## Troubleshooting Checklist

When something goes wrong, check:

### Backend Issues

- [ ] PM2 process running: `pm2 list`
- [ ] PM2 logs: `pm2 logs back-to-hills-backend`
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] Port 5454 not blocked
- [ ] Nginx reverse proxy configured correctly

### Frontend Issues

- [ ] Files exist in `/var/www/back-to-hills-frontend`
- [ ] Nginx configuration valid: `sudo nginx -t`
- [ ] Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] File permissions correct
- [ ] API URL correct in build

### Runner Issues

- [ ] Runner service running: `cd ~/actions-runner && sudo ./svc.sh status`
- [ ] Runner connected on GitHub
- [ ] Runner has necessary permissions
- [ ] Disk space available
- [ ] Network connectivity OK

---

## Emergency Contacts & Resources

### Important Commands

```bash
# Restart everything
sudo systemctl restart nginx
pm2 restart all

# View logs
pm2 logs
sudo tail -f /var/log/nginx/error.log

# Check status
pm2 status
sudo systemctl status nginx
```

### Documentation Links

- [Full Setup Guide](.github/CICD-SETUP.md)
- [Quick Start Guide](.github/QUICK-START.md)
- [Architecture Overview](.github/ARCHITECTURE.md)

### Support Resources

- GitHub Actions Docs: https://docs.github.com/en/actions
- PM2 Docs: https://pm2.keymetrics.io/docs/
- Nginx Docs: https://nginx.org/en/docs/

---

**Deployment Date**: ********\_********

**Deployed By**: ********\_********

**Notes**:

---

---

---

---

✅ **Checklist Complete** - Your application is ready for production!
