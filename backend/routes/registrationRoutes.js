const express = require("express");
const router = express.Router();
const {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
  getRegistrationStats,
  verifyRegistration,
  updatePaymentStatus,
  searchRegistration,
  downloadRegistrations,
} = require("../controllers/registrationController");
const {
  validateRegistrationData,
  validateUpdateData,
  validateQueryParams,
} = require("../middlewares/validation");

// Public routes
router.post("/", createRegistration);
router.get("/search/:query", searchRegistration);

// Admin routes (these would typically be protected with authentication middleware)
router.get("/", validateQueryParams, getRegistrations);
router.get("/download", downloadRegistrations);
router.get("/stats/summary", getRegistrationStats);
router.get("/:id", getRegistration);
router.put("/:id", validateUpdateData, updateRegistration);
router.delete("/:id", deleteRegistration);
router.patch("/:id/verify", verifyRegistration);
router.patch("/:id/payment", updatePaymentStatus);

module.exports = router;
