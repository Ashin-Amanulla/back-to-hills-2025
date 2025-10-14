# Docker + ECR + EC2 Deployment Guide

This guide explains the new deployment workflow using Docker, AWS ECR, and EC2.

## 🏗️ Architecture Overview

```
GitHub (Push to main)
  ↓
GitHub Actions (Build Docker Image)
  ↓
AWS ECR (Store Docker Image)
  ↓
EC2 Instance (Pull & Run Container)
```

## 🔧 Prerequisites

### AWS Resources

1. **AWS Account** with proper permissions
2. **ECR Repository** created
3. **EC2 Instance** running with:
   - Docker installed
   - AWS CLI installed and configured
   - Port 5000 (or your backend port) open in security group

### GitHub Secrets Required

Add these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

#### AWS Credentials

- `AWS_ACCESS_KEY_ID` - AWS IAM access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM secret key
- `AWS_REGION` - AWS region (e.g., `ap-south-1`)
- `ECR_REPOSITORY` - ECR repository name (e.g., `back-to-hills-backend`)

#### EC2 Access

- `EC2_HOST` - EC2 instance public IP or domain
- `EC2_USER` - SSH username (usually `ubuntu` or `ec2-user`)
- `EC2_SSH_KEY` - Private SSH key for EC2 access

#### Application Environment Variables

- `BACKEND_PORT` - Application port (e.g., `5000`)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `API_URL` - Backend API URL
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_HOST` - SMTP host
- `SMTP_PORT` - SMTP port
- `EMAIL_FROM` - Email sender address

## 📦 Setup Steps

### 1. Create ECR Repository

```bash
# Using AWS CLI
aws ecr create-repository \
  --repository-name back-to-hills-backend \
  --region ap-south-1
```

Or create via AWS Console: ECR → Repositories → Create repository

### 2. Configure EC2 Instance

SSH into your EC2 instance:

```bash
ssh ubuntu@your-ec2-ip
```

Install Docker:

```bash
# Update package manager
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter your AWS credentials when prompted
```

### 3. Configure IAM User Permissions

The IAM user needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": "*"
    }
  ]
}
```

### 4. Configure EC2 Security Group

Ensure your EC2 security group allows:

- Inbound: Port 5000 (or your backend port) from 0.0.0.0/0
- Inbound: Port 22 (SSH) from your IP
- Outbound: All traffic

### 5. Add Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add all required secrets listed above

## 🚀 Deployment Workflow

The deployment happens automatically when you push to the `main` branch:

1. **Build Phase** (GitHub Actions)

   - Checkout code
   - Configure AWS credentials
   - Login to ECR
   - Build Docker image
   - Push to ECR with commit SHA and 'latest' tags

2. **Deploy Phase** (EC2)
   - SSH into EC2
   - Stop existing container
   - Pull latest image from ECR
   - Run new container with environment variables
   - Clean up old images
   - Verify deployment

## 🔍 Manual Deployment Commands

If you need to deploy manually:

### Build and Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_REGISTRY

# Build image
cd backend
docker build -t back-to-hills-backend .

# Tag image
docker tag back-to-hills-backend:latest YOUR_ECR_REGISTRY/back-to-hills-backend:latest

# Push to ECR
docker push YOUR_ECR_REGISTRY/back-to-hills-backend:latest
```

### Deploy on EC2

```bash
# SSH into EC2
ssh ubuntu@your-ec2-ip

# Login to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_REGISTRY

# Stop existing container
docker stop back-to-hills-backend || true
docker rm back-to-hills-backend || true

# Pull latest image
docker pull YOUR_ECR_REGISTRY/back-to-hills-backend:latest

# Run container
docker run -d \
  --name back-to-hills-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  -e API_URL="your-api-url" \
  -e SMTP_USER="your-smtp-user" \
  -e SMTP_PASS="your-smtp-pass" \
  -e SMTP_HOST="your-smtp-host" \
  -e SMTP_PORT="your-smtp-port" \
  -e EMAIL_FROM="your-email-from" \
  YOUR_ECR_REGISTRY/back-to-hills-backend:latest
```

## 📊 Monitoring & Debugging

### Check Container Status

```bash
docker ps -a | grep back-to-hills-backend
```

### View Logs

```bash
# Live logs
docker logs -f back-to-hills-backend

# Last 100 lines
docker logs --tail 100 back-to-hills-backend

# Logs with timestamps
docker logs --timestamps back-to-hills-backend
```

### Health Check

```bash
# From EC2
curl http://localhost:5000/api/health

# From outside
curl http://your-ec2-ip:5000/api/health
```

### Enter Container Shell

```bash
docker exec -it back-to-hills-backend sh
```

### Check Resource Usage

```bash
docker stats back-to-hills-backend
```

## 🛠️ Troubleshooting

### Issue: Container won't start

```bash
# Check logs for errors
docker logs back-to-hills-backend

# Check if port is already in use
sudo lsof -i :5000

# Check Docker service status
sudo systemctl status docker
```

### Issue: ECR login fails

```bash
# Reconfigure AWS CLI
aws configure

# Test ECR access
aws ecr describe-repositories --region ap-south-1
```

### Issue: Environment variables not working

```bash
# Check container environment
docker exec back-to-hills-backend env

# Inspect container
docker inspect back-to-hills-backend
```

### Issue: Out of disk space

```bash
# Clean up old images
docker system prune -af

# Remove unused volumes
docker volume prune -f

# Check disk usage
df -h
docker system df
```

## 🔄 Rollback Procedure

If you need to rollback to a previous version:

```bash
# List available image tags
aws ecr list-images --repository-name back-to-hills-backend --region ap-south-1

# Pull specific version
docker pull YOUR_ECR_REGISTRY/back-to-hills-backend:COMMIT_SHA

# Stop current container
docker stop back-to-hills-backend
docker rm back-to-hills-backend

# Run previous version
docker run -d \
  --name back-to-hills-backend \
  --restart unless-stopped \
  -p 5000:5000 \
  [... environment variables ...] \
  YOUR_ECR_REGISTRY/back-to-hills-backend:COMMIT_SHA
```

## ✅ Best Practices

1. **Always tag images with commit SHA** - Enables easy rollback
2. **Use secrets for sensitive data** - Never hardcode credentials
3. **Monitor container logs** - Set up CloudWatch or similar
4. **Regular backups** - Backup MongoDB and configuration
5. **Health checks** - Implement proper health check endpoints
6. **Resource limits** - Set memory and CPU limits in production
7. **SSL/TLS** - Use HTTPS with proper certificates (nginx/ALB)

## 🔐 Security Checklist

- [ ] ECR repository has proper access policies
- [ ] EC2 security group restricts SSH to known IPs
- [ ] All secrets are stored in GitHub Secrets
- [ ] Container runs as non-root user (nodejs)
- [ ] Regular security updates on EC2
- [ ] Enable ECR image scanning
- [ ] Use VPC for database connections
- [ ] Enable CloudTrail for AWS audit logs

## 📞 Support

If issues persist:

1. Check GitHub Actions workflow logs
2. Check EC2 system logs: `journalctl -xe`
3. Check Docker logs: `docker logs back-to-hills-backend`
4. Verify all GitHub secrets are set correctly
5. Ensure EC2 has proper IAM role or AWS CLI credentials
