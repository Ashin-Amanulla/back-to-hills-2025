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
  sendConfirmationEmail,
} = require("../controllers/registrationController");
const {

  validateQueryParams,
} = require("../middlewares/validation");
const verifyToken = require("../middlewares/auth");
// Public routess
router.post("/", createRegistration);

//create auth routes
router.use(verifyToken);
router.get("/search/:query", searchRegistration);

// Admin routes (these would typically be protected with authentication middleware)
router.get("/",  getRegistrations);
router.get("/download", downloadRegistrations);
router.get("/stats/summary", getRegistrationStats);
router.get("/send-confirmation-email", sendConfirmationEmail);
router.get("/:id", getRegistration);
router.put("/:id",  updateRegistration);
router.delete("/:id", deleteRegistration);
router.patch("/:id/verify", verifyRegistration);
router.patch("/:id/payment", updatePaymentStatus);
module.exports = router;
