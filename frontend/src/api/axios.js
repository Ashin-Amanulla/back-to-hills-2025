import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api-btth.jnvcan.com/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("adminToken") || "";

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Function to handle authentication errors and logout
const handleAuthError = () => {
  // Clear local storage
  localStorage.removeItem("adminToken");

  // Clear Zustand persist storage
  localStorage.removeItem("auth-storage");

  // Redirect to login page
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication and authorization errors
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized (invalid/expired token)
      // Handle 403 Forbidden (insufficient permissions)
      if (status === 401 || status === 403) {
        handleAuthError();
      }
    } else if (error.request) {
      // Network error - check if token might be invalid
      console.error("Network error:", error.message);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
