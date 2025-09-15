# Onam Registration API - UNMA Bangalore Chapter

A comprehensive backend API for managing Onam event registrations built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Complete Registration Management**: Create, read, update, and delete registrations
- **Comprehensive Validation**: Input validation using Joi with detailed error messages
- **Payment Tracking**: Track payment status and transaction IDs
- **Statistics Dashboard**: Get detailed analytics and statistics
- **Search Functionality**: Search registrations by email or transaction ID
- **Admin Operations**: Verify registrations, update payment status
- **Security**: Rate limiting, CORS protection, input sanitization
- **Error Handling**: Centralized error handling with detailed logging

## 📋 API Endpoints

### Public Endpoints

- `POST /api/registrations` - Create new registration
- `GET /api/registrations/search/:query` - Search registration by email/transaction ID

### Admin Endpoints

- `GET /api/registrations` - Get all registrations (with pagination and filtering)
- `GET /api/registrations/:id` - Get single registration
- `PUT /api/registrations/:id` - Update registration
- `DELETE /api/registrations/:id` - Delete registration
- `PATCH /api/registrations/:id/verify` - Verify/unverify registration
- `PATCH /api/registrations/:id/payment` - Update payment status
- `GET /api/registrations/stats/summary` - Get registration statistics

### Utility Endpoints

- `GET /health` - Health check
- `GET /` - API information

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/onam-registration

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

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas for cloud database
```

### 4. Run the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### Registration Model

The registration schema includes:

#### Personal Information

- `name`, `email`, `whatsappNumber`, `age`, `gender`
- `country`, `stateUT`, `district`, `city`, `pincode`, `location`
- `yearOfPassing`, `houseColor`

#### Registration Details

- `registrationTypes` (array): attendee, sponsor, donor, volunteer, passout-student
- `isAttending`, `attendees` (adults, children, infants)

#### Event Preferences

- `eventParticipation`, `participationDetails`
- `traditionalDress`, `culturalProgram`, `programType`
- `flowerArrangement`, `pookalamSize`

#### Additional Categories

- `sponsorshipDetails`, `donationDetails`, `volunteerDetails`, `passportDetails`

#### Payment Information

- `contributionAmount`, `proposedAmount`, `paymentStatus`, `paymentTransactionId`

#### System Fields

- `registrationDate`, `status`, `verified`, `verificationDate`, `verifiedBy`

## 🔧 Usage Examples

### Create Registration

```javascript
const response = await fetch("http://localhost:5000/api/registrations", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    whatsappNumber: "9876543210",
    gender: "male",
    stateUT: "Kerala",
    district: "Thiruvananthapuram",
    houseColor: "red",
    yearOfPassing: 2020,
    registrationTypes: ["attendee"],
    isAttending: true,
    attendees: {
      adults: 2,
      children: 1,
      infants: 0,
    },
    contributionAmount: 1900,
    proposedAmount: 1900,
    paymentTransactionId: "TXN123456789",
  }),
});
```

### Get Registrations with Pagination

```javascript
const response = await fetch(
  "http://localhost:5000/api/registrations?page=1&limit=10&status=active"
);
```

### Search Registration

```javascript
const response = await fetch(
  "http://localhost:5000/api/registrations/search/john@example.com"
);
```

### Get Statistics

```javascript
const response = await fetch(
  "http://localhost:5000/api/registrations/stats/summary"
);
```

## 🧪 Seeding Database

To populate the database with sample data:

```javascript
const { seedDatabase } = require("./seeds/seedData");
await seedDatabase();
```

This will create sample registrations for testing and development.

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable request limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive validation using Joi
- **Helmet**: Security headers protection
- **Error Handling**: Secure error messages without sensitive data exposure

## 📈 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Tracking**: Centralized error handling and logging
- **Health Checks**: Built-in health monitoring endpoint
- **Performance**: Compression and optimization middleware

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onam-registration
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-production-secret-key
```

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the UNMA Bangalore Chapter team.

---

**Happy Coding! 🎉**
