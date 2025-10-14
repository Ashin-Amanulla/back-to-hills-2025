# Production Deployment Fix Guide

## 🔴 Current Issue

**Error:** `Cannot find module '../encodings'` in `iconv-lite` package

This error occurs when dependencies are not properly installed in production.

## ⚡ Immediate Fix (Run on Production Server)

### Option 1: Using the Fix Script

```bash
# SSH into your production server
ssh ubuntu@your-server-ip

# Navigate to backend directory
cd /home/ubuntu/actions-runner/_work/back-to-hills-2025/back-to-hills-2025/backend

# Make the fix script executable
chmod +x scripts/fix-production-deps.sh

# Run the fix script
./scripts/fix-production-deps.sh
```

### Option 2: Manual Fix

```bash
# SSH into your production server
ssh ubuntu@your-server-ip

# Navigate to backend directory
cd /home/ubuntu/actions-runner/_work/back-to-hills-2025/back-to-hills-2025/backend

# Stop the application
pm2 stop backend

# Remove corrupted dependencies
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies fresh
npm install --production

# Verify iconv-lite installation
ls -la node_modules/iconv-lite/encodings

# Restart application
pm2 restart backend
pm2 save
```

## 🔧 Root Cause

The issue occurs when:

1. Dependencies are installed incompletely during deployment
2. `npm install` is interrupted or fails partially
3. `node_modules` from development are copied instead of being installed fresh
4. npm cache is corrupted

## ✅ Long-term Solution

### 1. Use GitHub Actions Workflow

A proper GitHub Actions workflow has been created at `.github/workflows/deploy-backend.yml` that:

- Installs dependencies correctly
- Creates a clean deployment package
- Deploys to server properly

### 2. Required GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `SERVER_HOST`: Your production server IP/domain
- `SERVER_USER`: SSH username (usually 'ubuntu')
- `SERVER_SSH_KEY`: Private SSH key for server access

### 3. Deployment Best Practices

- ✅ Always use `npm ci` in CI/CD pipelines (faster and more reliable)
- ✅ Always commit and track `package-lock.json`
- ✅ Never copy `node_modules` to production
- ✅ Always install dependencies fresh on production server
- ✅ Use `.npmrc` for consistent dependency resolution
- ✅ Clear npm cache if issues persist

## 🔍 Verification

After applying the fix, verify the installation:

```bash
# Check if encodings directory exists
ls -la node_modules/iconv-lite/encodings

# List iconv-lite package structure
npm list iconv-lite

# Test the API endpoint
curl -X POST https://api-btth.jnvcan.com/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📝 Deployment Checklist

- [ ] Remove old `node_modules` and `package-lock.json`
- [ ] Clear npm cache
- [ ] Install dependencies fresh with `npm install --production`
- [ ] Verify `iconv-lite/encodings` exists
- [ ] Restart application with PM2
- [ ] Test API endpoints
- [ ] Monitor logs for errors

## 🚨 If Issue Persists

1. Check Node.js version on server matches `package.json` engines requirement (>=16.0.0)
2. Check npm version (should be npm 8+ for best results)
3. Check disk space on server
4. Check file permissions on `node_modules`
5. Try installing specific version: `npm install iconv-lite@0.6.3`

## 📞 Support

If the issue continues, check:

- PM2 logs: `pm2 logs backend`
- Application logs in `backend/logs/`
- System logs: `journalctl -u backend -n 100`
