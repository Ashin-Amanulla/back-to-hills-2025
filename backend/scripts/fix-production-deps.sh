#!/bin/bash

# Script to fix production dependency issues
# Run this on your production server to resolve the iconv-lite missing module error

echo "🔧 Fixing production dependencies..."

# Navigate to backend directory
cd "$(dirname "$0")/.." || exit 1

# Display current directory
echo "📂 Working directory: $(pwd)"

# Stop the application (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "⏸️  Stopping application..."
    pm2 stop backend || true
fi

# Remove corrupted node_modules and package-lock
echo "🗑️  Removing existing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Install dependencies fresh
echo "📦 Installing dependencies..."
npm install --production

# Verify iconv-lite installation
echo "✅ Verifying iconv-lite installation..."
if [ -d "node_modules/iconv-lite/encodings" ]; then
    echo "✅ iconv-lite encodings found!"
else
    echo "❌ iconv-lite encodings still missing. Installing manually..."
    npm install iconv-lite --force
fi

# Restart the application (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "▶️  Starting application..."
    pm2 restart backend || pm2 start ecosystem.config.js --env production
    pm2 save
fi

echo "✅ Dependencies fixed successfully!"
echo "🔍 Run 'npm list iconv-lite' to verify installation"

