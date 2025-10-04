const Joi = require("joi");

// Personal Details Validation for Back to Hills 4.0
const personalDetailsSchema = {
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Full name is required",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Please enter a valid 10-digit mobile number starting with 6-9",
      "string.empty": "Mobile number is required",
      "any.required": "Mobile number is required",
    }),

  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Gender must be one of: Male, Female, Other",
    "string.empty": "Gender is required",
    "any.required": "Gender is required",
  }),

  batch: Joi.string()
    .valid(
      "Batch 1",
      "Batch 2",
      "Batch 3",
      "Batch 4",
      "Batch 5",
      "Batch 6",
      "Batch 7",
      "Batch 8",
      "Batch 9",
      "Batch 10",
      "Batch 11",
      "Batch 12",
      "Batch 13",
      "Batch 14",
      "Batch 15",
      "Batch 16",
      "Batch 17",
      "Batch 18",
      "Batch 19",
      "Batch 20",
      "Batch 21",
      "Batch 22",
      "Batch 23",
      "Batch 24",
      "Batch 25",
      "Batch 26",
      "Batch 27",
      "Batch 28",
      "Batch 29",
      "Batch 30",
      "Batch 31",
      "Batch 32"
    )
    .required()
    .messages({
      "any.only": "Please select a valid batch (Batch 1 - Batch 32)",
      "string.empty": "Batch is required",
      "any.required": "Batch is required",
    }),
};

// Event Preferences Validation
const eventPreferencesSchema = {
  foodChoice: Joi.string().valid("Veg", "Non-Veg").required().messages({
    "any.only": "Food choice must be either Veg or Non-Veg",
    "string.empty": "Food choice is required",
    "any.required": "Food choice is required",
  }),

  expectedArrivalTime: Joi.string()
    .valid("8-11", "11-14", "14-17", "17-20")
    .required()
    .messages({
      "any.only":
        "Expected arrival time must be one of: 8-11, 11-14, 14-17, 17-20",
      "string.empty": "Expected arrival time is required",
      "any.required": "Expected arrival time is required",
    }),

  overnightAccommodation: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Overnight accommodation must be Yes or No",
    "string.empty": "Overnight accommodation preference is required",
    "any.required": "Overnight accommodation preference is required",
  }),
};

// Attendees Validation
const attendeesSchema = Joi.object({
  adults: Joi.number().integer().min(0).default(0).messages({
    "number.min": "Number of adults cannot be negative",
    "number.base": "Number of adults must be a valid number",
  }),

  children: Joi.number().integer().min(0).default(0).messages({
    "number.min": "Number of children cannot be negative",
    "number.base": "Number of children must be a valid number",
  }),

  infants: Joi.number().integer().min(0).default(0).messages({
    "number.min": "Number of infants cannot be negative",
    "number.base": "Number of infants must be a valid number",
  }),
});

// Guest Information Validation
const guestSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Guest name is required",
    "string.min": "Guest name must be at least 2 characters long",
    "string.max": "Guest name cannot exceed 100 characters",
    "any.required": "Guest name is required",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Guest gender must be one of: Male, Female, Other",
    "string.empty": "Guest gender is required",
    "any.required": "Guest gender is required",
  }),

  foodChoice: Joi.string().valid("Veg", "Non-Veg").required().messages({
    "any.only": "Guest food choice must be either Veg or Non-Veg",
    "string.empty": "Guest food choice is required",
    "any.required": "Guest food choice is required",
  }),

  ageCategory: Joi.string()
    .valid("Adult", "Child", "Infant")
    .required()
    .messages({
      "any.only": "Guest age category must be one of: Adult, Child, Infant",
      "string.empty": "Guest age category is required",
      "any.required": "Guest age category is required",
    }),
});

const guestsSchema = Joi.array().items(guestSchema).optional().messages({
  "array.base": "Guests must be an array",
});

// Payment Validation
const paymentSchema = {
  contributionAmount: Joi.number().min(0).required().messages({
    "number.min": "Contribution amount cannot be negative",
    "number.base": "Contribution amount must be a valid number",
    "any.required": "Contribution amount is required",
  }),

  paymentTransactionId: Joi.string().trim().required().messages({
    "string.empty": "Payment transaction ID is required",
    "any.required": "Payment transaction ID is required",
  }),
};

// Main Registration Validation Schema for Back to Hills 4.0
const createRegistrationSchema = Joi.object({
  // Personal Details
  ...personalDetailsSchema,

  // Event Preferences
  ...eventPreferencesSchema,

  // Attendees
  attendees: attendeesSchema.required(),

  // Guest Information
  guests: guestsSchema,

  // Payment Information
  ...paymentSchema,
});

// Update Registration Schema (all fields optional except _id)
const updateRegistrationSchema = Joi.object({
  // Personal Details
  name: personalDetailsSchema.name.optional(),
  email: personalDetailsSchema.email.optional(),
  mobile: personalDetailsSchema.mobile.optional(),
  gender: personalDetailsSchema.gender.optional(),
  batch: personalDetailsSchema.batch.optional(),

  // Event Preferences
  foodChoice: eventPreferencesSchema.foodChoice.optional(),
  expectedArrivalTime: eventPreferencesSchema.expectedArrivalTime.optional(),
  overnightAccommodation:
    eventPreferencesSchema.overnightAccommodation.optional(),

  // Attendees and Guests
  attendees: attendeesSchema.optional(),
  guests: guestsSchema,

  // Payment Information
  contributionAmount: paymentSchema.contributionAmount.optional(),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .optional(),
  paymentTransactionId: paymentSchema.paymentTransactionId.optional(),

  // Status Fields
  verified: Joi.boolean().optional(),
  isEmailSent: Joi.boolean().optional(),
});

// Query Parameters Validation
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid("createdAt", "name", "email", "contributionAmount", "batch")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .optional(),
  verified: Joi.boolean().optional(),
  batch: Joi.string().optional(),
  search: Joi.string().trim().max(100).optional(),
});

// Validate registration data
const validateRegistration = (data) => {
  return createRegistrationSchema.validate(data, { abortEarly: false });
};

// Validate update data
const validateUpdate = (data) => {
  return updateRegistrationSchema.validate(data, { abortEarly: false });
};

// Validate query parameters
const validateQuery = (data) => {
  return queryParamsSchema.validate(data, { abortEarly: false });
};

module.exports = {
  createRegistrationSchema,
  updateRegistrationSchema,
  queryParamsSchema,
  validateRegistration,
  validateUpdate,
  validateQuery,
};
