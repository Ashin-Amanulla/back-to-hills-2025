# CI/CD Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                        │
│  ┌────────────────┐              ┌─────────────────┐            │
│  │  Backend Code  │              │  Frontend Code  │            │
│  └────────┬───────┘              └────────┬────────┘            │
│           │                               │                      │
│           │  Push to main                 │  Push to main        │
│           ▼                               ▼                      │
│  ┌────────────────┐              ┌─────────────────┐            │
│  │ Backend.yml    │              │ Frontend.yml    │            │
│  │ Workflow       │              │ Workflow        │            │
│  └────────┬───────┘              └────────┬────────┘            │
└───────────┼──────────────────────────────┼─────────────────────┘
            │                               │
            └───────────┬───────────────────┘
                        │ Triggers
                        ▼
        ┌───────────────────────────────────────┐
        │     AWS EC2 Instance (Ubuntu)         │
        │  ┌─────────────────────────────────┐  │
        │  │   GitHub Self-Hosted Runner     │  │
        │  │   - Picks up workflow jobs      │  │
        │  │   - Executes deployment steps   │  │
        │  └─────────────────────────────────┘  │
        │                                        │
        │  ┌──────────────┐  ┌──────────────┐  │
        │  │   Backend    │  │   Frontend   │  │
        │  │   Deployment │  │   Deployment │  │
        │  └──────┬───────┘  └──────┬───────┘  │
        │         │                  │          │
        │         ▼                  ▼          │
        │  ┌──────────────┐  ┌──────────────┐  │
        │  │     PM2      │  │    Nginx     │  │
        │  │ Process Mgr  │  │ Web Server   │  │
        │  │              │  │              │  │
        │  │ ┌─────────┐  │  │ /var/www/    │  │
        │  │ │ Node.js │  │  │ static files │  │
        │  │ │ Express │  │  │              │  │
        │  │ └─────────┘  │  │              │  │
        │  │   Port 5454  │  │   Port 80/443│  │
        │  └──────┬───────┘  └──────┬───────┘  │
        └─────────┼──────────────────┼──────────┘
                  │                  │
                  │  Reverse Proxy   │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Internet     │
                  │                 │
                  │  ┌───────────┐  │
                  │  │   Users   │  │
                  │  └───────────┘  │
                  └─────────────────┘

Database Layer:
┌──────────────────────┐
│    MongoDB           │
│                      │
│  - Local Instance    │
│    or                │
│  - MongoDB Atlas     │
│    (Cloud)           │
└──────────────────────┘
```

## Component Breakdown

### 1. GitHub Repository

- **Purpose**: Source code version control
- **Components**:
  - Backend codebase (`/backend`)
  - Frontend codebase (`/frontend`)
  - GitHub Actions workflows (`/.github/workflows`)
  - Configuration files

### 2. GitHub Actions Workflows

#### Backend Workflow (`backend.yml`)

```yaml
Trigger: Push to main (backend/** changed)
Jobs: 1. Test
  - Checkout code
  - Setup Node.js
  - Install dependencies
  - Run linting
  - Run tests

  2. Deploy (if tests pass)
  - Checkout code
  - Create .env with secrets
  - Install production dependencies
  - Stop existing PM2 process
  - Start new PM2 process
  - Verify health
  - Save PM2 state
```

#### Frontend Workflow (`frontend.yml`)

```yaml
Trigger: Push to main (frontend/** changed)
Jobs: 1. Build
  - Checkout code
  - Setup Node.js
  - Install dependencies
  - Run linting
  - Create .env for build
  - Build production bundle
  - Upload artifacts

  2. Deploy (if build succeeds)
  - Download artifacts
  - Copy to Nginx directory
  - Set permissions
  - Test Nginx config
  - Reload Nginx
  - Verify deployment
```

### 3. AWS EC2 Instance

**Instance Specifications (Recommended)**:

- **Type**: t3.medium or higher
- **vCPUs**: 2
- **RAM**: 4 GB
- **Storage**: 30 GB SSD
- **OS**: Ubuntu 22.04 LTS

**Installed Software**:

- Node.js 20.x LTS
- PM2 (Process Manager)
- Nginx (Web Server)
- GitHub Actions Runner
- MongoDB (optional, if not using Atlas)
- Git
- Certbot (for SSL)

### 4. GitHub Self-Hosted Runner

**Purpose**: Execute GitHub Actions workflows on your EC2 instance

**Features**:

- Runs as a systemd service
- Auto-starts on server reboot
- Executes workflows in isolated environments
- Direct access to EC2 file system and services

**Location**: `~/actions-runner`

### 5. Backend Application Stack

#### PM2 Process Manager

- **Purpose**: Keep Node.js app running
- **Features**:
  - Auto-restart on crashes
  - Log management
  - Memory monitoring
  - Cluster mode support
  - Startup script generation

#### Express.js API

- **Port**: 5454 (internal)
- **Process Name**: `back-to-hills-backend`
- **Environment**: Production
- **Features**:
  - RESTful API
  - JWT authentication
  - Email notifications
  - Database operations

### 6. Frontend Application Stack

#### Nginx Web Server

- **Port**: 80 (HTTP), 443 (HTTPS)
- **Purpose**: Serve static files and reverse proxy
- **Configuration**:
  - Serves React SPA from `/var/www/back-to-hills-frontend`
  - Gzip compression
  - Asset caching
  - Reverse proxy for API
  - SSL/TLS termination

#### React Application

- **Framework**: React + Vite
- **Build Output**: Static files (HTML, CSS, JS)
- **Routing**: Client-side routing
- **API**: Communicates with backend via axios

### 7. Database Layer

#### MongoDB Options

**Option A: Local MongoDB**

- Runs on EC2 instance
- Port 27017 (localhost only)
- Good for development/small scale

**Option B: MongoDB Atlas (Recommended)**

- Managed cloud database
- Better scalability
- Automatic backups
- No EC2 maintenance

## Traffic Flow

### User Request Flow

1. **Frontend Request**:

   ```
   User Browser → HTTPS (443) → Nginx → Static Files → Response
   ```

2. **API Request**:
   ```
   User Browser → HTTPS (443) → Nginx (Reverse Proxy)
   → http://localhost:5454 → PM2 → Express.js → MongoDB → Response
   ```

### Deployment Flow

1. **Backend Deployment**:

   ```
   Git Push → GitHub → Triggers Workflow → Runner Downloads Code
   → Installs Dependencies → Creates .env → PM2 Restart → Live
   ```

2. **Frontend Deployment**:
   ```
   Git Push → GitHub → Triggers Workflow → Runner Downloads Code
   → Builds Production Bundle → Copies to /var/www → Nginx Reload → Live
   ```

## Security Layers

### 1. Network Security

```
┌─────────────────────────────────┐
│    AWS Security Group           │
│  - SSH (22): Your IP only       │
│  - HTTP (80): 0.0.0.0/0         │
│  - HTTPS (443): 0.0.0.0/0       │
│  - API (5454): Localhost only   │
│  - MongoDB (27017): Localhost   │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│    Ubuntu UFW Firewall          │
│  - OpenSSH: Allowed             │
│  - Nginx Full: Allowed          │
│  - Rate limiting enabled        │
└─────────────────────────────────┘
```

### 2. Application Security

- JWT authentication
- Password hashing (bcrypt)
- Input validation (Joi)
- CORS configuration
- Rate limiting
- Helmet security headers
- Environment variable secrets

### 3. SSL/TLS

- Let's Encrypt certificates
- Auto-renewal via Certbot
- HTTPS enforced
- Secure headers

## Monitoring Points

### Application Level

```
PM2 Monitoring:
- CPU usage
- Memory usage
- Restart count
- Uptime
- Error logs
```

### System Level

```
System Monitoring:
- Disk usage: df -h
- Memory: free -h
- CPU: top/htop
- Network: netstat
- Logs: journalctl
```

### Web Server

```
Nginx Monitoring:
- Access logs
- Error logs
- Status: systemctl status
- Configuration: nginx -t
```

## Backup Strategy

### What to Backup

1. **Database**

   - MongoDB dumps
   - Frequency: Daily
   - Retention: 30 days

2. **Application Code**

   - Git repository (already backed up)
   - Environment files (encrypted)

3. **Configuration**

   - Nginx configs
   - PM2 configs
   - SSL certificates

4. **Logs**
   - Application logs
   - System logs
   - Archive old logs

## Scaling Considerations

### Vertical Scaling (Current Setup)

- Upgrade EC2 instance type
- Increase storage
- More RAM/CPU

### Horizontal Scaling (Future)

- Multiple EC2 instances
- Load balancer (AWS ELB)
- Separate database server
- Redis for caching
- CDN for static assets

## Cost Estimation (AWS)

```
Monthly Costs (Approximate):
┌──────────────────────┬──────────┐
│ EC2 t3.medium        │ $30-40   │
│ EBS Storage (30GB)   │ $3-5     │
│ Data Transfer        │ $5-10    │
│ MongoDB Atlas (Free) │ $0       │
├──────────────────────┼──────────┤
│ Total                │ $40-55   │
└──────────────────────┴──────────┘

Note: Prices vary by region and usage
```

## High Availability Improvements

For production systems requiring 99.9%+ uptime:

1. **Multi-AZ Deployment**

   - EC2 instances in multiple availability zones
   - Load balancer for distribution

2. **Database Replication**

   - MongoDB replica set
   - Automatic failover

3. **Health Checks**

   - Application health endpoints
   - Auto-restart on failure

4. **Monitoring & Alerts**

   - CloudWatch metrics
   - Email/SMS alerts
   - Uptime monitoring

5. **Disaster Recovery**
   - Automated backups
   - Snapshot schedules
   - Recovery procedures

## Environment Variables Map

```
Backend (.env):
├── NODE_ENV=production
├── PORT=5454
├── MONGODB_URI=mongodb://...
├── JWT_SECRET=...
├── JWT_EXPIRES_IN=7d
├── EMAIL_HOST=smtp.gmail.com
├── EMAIL_PORT=587
├── EMAIL_USER=...
├── EMAIL_PASS=...
├── EMAIL_FROM=...
└── FRONTEND_URL=https://...

Frontend (.env):
├── VITE_API_URL=https://api...
└── VITE_APP_NAME=Back to Hills 2025
```

## Workflow Triggers

```
Backend Workflow Triggers:
✅ Push to main branch
✅ Changes in backend/** directory
✅ Changes in .github/workflows/backend.yml
❌ Pull requests (test only, no deploy)

Frontend Workflow Triggers:
✅ Push to main branch
✅ Changes in frontend/** directory
✅ Changes in .github/workflows/frontend.yml
❌ Pull requests (build only, no deploy)
```

---

This architecture provides a solid foundation for a production-ready application with automated deployments, monitoring, and security best practices.
