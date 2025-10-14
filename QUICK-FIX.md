# ⚡ QUICK FIX - Production Deployment Error

## Error: `Cannot find module '../encodings'`

### 🚀 Immediate Fix (Copy & Paste on Server)

**Step 1:** SSH into your server

```bash
ssh ubuntu@your-server-ip
```

**Step 2:** Run this ONE command to fix everything

```bash
cd /home/ubuntu/actions-runner/_work/back-to-hills-2025/back-to-hills-2025/backend && \
pm2 stop backend && \
rm -rf node_modules package-lock.json && \
npm cache clean --force && \
npm install --production && \
pm2 restart backend && \
pm2 save && \
echo "✅ Fixed! Check status with: pm2 status"
```

**Step 3:** Verify it works

```bash
curl -X GET https://api-btth.jnvcan.com/api/health
```

---

## 📋 Alternative: Use the Fix Script

```bash
cd /home/ubuntu/actions-runner/_work/back-to-hills-2025/back-to-hills-2025/backend
chmod +x scripts/fix-production-deps.sh
./scripts/fix-production-deps.sh
```

---

## 🔍 Check Status

```bash
pm2 status
pm2 logs backend --lines 50
```

---

## ✅ Verify Dependencies

```bash
ls -la node_modules/iconv-lite/encodings
npm list iconv-lite
```

---

## 🆘 If Still Not Working

1. Check Node version: `node -v` (should be >=16)
2. Check npm version: `npm -v` (should be >=8)
3. Check disk space: `df -h`
4. Check PM2 process: `pm2 describe backend`
5. See full deployment guide: `DEPLOYMENT-FIX.md`
