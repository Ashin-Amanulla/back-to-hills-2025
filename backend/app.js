const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import database connection
const connectDB = require("./config/database");

// Import routes
const userRoutes = require("./routes/userRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
// Import middlewares
const errorHandler = require("./middlewares/errorHandler");

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Rate limiting

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware

app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Back to Hills 5.0 Alumni Registration API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API route
app.use("/api/users", userRoutes);
app.use("/api/registrations", registrationRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to BTTH 5.0 API ",     
    version: "1.0.0",
    endpoints: {
      health: "/health",
      registrations: "/api/registrations",
      search: "/api/registrations/search/:query",
      stats: "/api/registrations/stats/summary",
    },
    documentation: "API documentation available at /api/docs (coming soon)",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || "development"} mode
📡 Server listening on port ${PORT}
🌐 Health check: http://localhost:${PORT}/health
📋 API base URL: http://localhost:${PORT}/api
🎉 BTTH 5.0 API ready!
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;
