const {
  validateRegistration,
  validateUpdate,
  validateQuery,
} = require("../validators/registration");

// Validate registration data
const validateRegistrationData = (req, res, next) => {
  const { error, value } = validateRegistration(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errorMessages,
    });
  }

  req.body = value;
  next();
};

// Validate update data
const validateUpdateData = (req, res, next) => {
  const { error, value } = validateUpdate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errorMessages,
    });
  }

  req.body = value;
  next();
};

// Validate query parameters
const validateQueryParams = (req, res, next) => {
  const { error, value } = validateQuery(req.query);

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Query Validation Error",
      errors: errorMessages,
    });
  }

  req.query = value;
  next();
};

module.exports = {
  validateRegistrationData,
  validateUpdateData,
  validateQueryParams,
};
