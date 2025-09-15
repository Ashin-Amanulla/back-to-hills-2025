# Configuration Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/onam-registration
# For production, use: mongodb+srv://username:password@cluster.mongodb.net/onam-registration

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin Configuration
ADMIN_EMAIL=admin@unmabangalore.com
ADMIN_PASSWORD=admin123

# Payment Configuration
PAYMENT_VERIFICATION_ENABLED=false
```

## Quick Setup

1. Copy the environment variables above into a `.env` file
2. Install dependencies: `npm install`
3. Start MongoDB service
4. Run the application: `npm run dev`
5. Seed the database (optional): `npm run seed`

## MongoDB Setup

### Local MongoDB

```bash
# Install MongoDB
# Start MongoDB service
mongod
```

### MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in .env file
