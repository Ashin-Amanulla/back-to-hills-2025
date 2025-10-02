const Joi = require("joi");

// Personal Details Validation
const personalDetailsSchema = {
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  whatsappNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Please enter a valid 10-digit mobile number starting with 6-9",
      "string.empty": "Mobile number is required",
      "any.required": "Mobile number is required",
    }),

  age: Joi.number().integer().min(1).max(120).optional().messages({
    "number.min": "Age must be at least 1",
    "number.max": "Age cannot exceed 120",
    "number.base": "Age must be a valid number",
  }),

  gender: Joi.string()
    .valid("male", "female", "other", "prefer-not-to-say")
    .required()
    .messages({
      "any.only":
        "Gender must be one of: male, female, other, prefer-not-to-say",
      "string.empty": "Gender is required",
      "any.required": "Gender is required",
    }),

  country: Joi.string().default("IN"),

  stateUT: Joi.string().required().messages({
    "string.empty": "State/UT is required",
    "any.required": "State/UT is required",
  }),

  district: Joi.string()
    .when("stateUT", {
      is: "Kerala",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required": "District is required when State/UT is Kerala",
    }),

  city: Joi.string().trim().max(100).optional(),

  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please enter a valid 6-digit pincode",
    }),

  location: Joi.string().trim().max(200).optional(),

  yearOfPassing: Joi.number()
    .integer()
    .min(1990)
    .max(new Date().getFullYear() + 1)
    .optional()
    .messages({
      "number.min": "Year of passing cannot be before 1990",
      "number.max": "Year of passing cannot be in the future",
      "number.base": "Year of passing must be a valid number",
    }),

  houseColor: Joi.string()
    .valid(
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "not-sure"
    )
    .required()
    .messages({
      "any.only": "House color must be one of the available options",
      "string.empty": "House color is required",
      "any.required": "House color is required",
    }),
};

// Registration Types Validation
const registrationTypesSchema = Joi.array()
  .items(
    Joi.string().valid(
      "attendee",
      "sponsor",
      "donor",
      "volunteer",
      "passout-student"
    )
  )
  .min(1)
  .required()
  .messages({
    "array.min": "Please select at least one registration category",
    "any.required": "Registration types are required",
  });

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

// Event Preferences Validation
const eventPreferencesSchema = {
  isAttending: Joi.boolean().default(true),

  attendees: attendeesSchema.required(),

  eventParticipation: Joi.array()
    .items(Joi.string().valid("pookalam", "cultural", "games", "volunteer"))
    .optional(),

  participationDetails: Joi.string().max(500).optional().messages({
    "string.max": "Participation details cannot exceed 500 characters",
  }),

  traditionalDress: Joi.boolean().default(false),

  culturalProgram: Joi.boolean().default(false),

  programType: Joi.string()
    .valid(
      "classical-dance",
      "folk-dance",
      "music",
      "poetry",
      "skit",
      "other",
      ""
    )
    .when("culturalProgram", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required":
        "Program type is required when cultural program is selected",
    }),

  flowerArrangement: Joi.boolean().default(false),

  pookalamSize: Joi.string()
    .valid("small", "medium", "large", "extra-large", "")
    .when("flowerArrangement", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required":
        "Pookalam size is required when flower arrangement is selected",
    }),
};

// Sponsorship Details Validation
const sponsorshipDetailsSchema = Joi.object({
  enterpriseName: Joi.string().trim().max(100).optional().messages({
    "string.max": "Enterprise name cannot exceed 100 characters",
  }),

  sponsorshipLevel: Joi.string()
    .valid("bronze", "silver", "gold", "platinum", "")
    .optional(),

  sponsorshipAmount: Joi.number().min(0).optional().messages({
    "number.min": "Sponsorship amount cannot be negative",
    "number.base": "Sponsorship amount must be a valid number",
  }),

  contactPerson: Joi.string().trim().max(100).optional().messages({
    "string.max": "Contact person name cannot exceed 100 characters",
  }),

  phoneNumber: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({
      "string.pattern.base": "Please enter a valid 10-digit phone number",
    }),

  email: Joi.string().email().lowercase().optional().messages({
    "string.email": "Please enter a valid email address",
  }),
});

// Donation Details Validation
const donationDetailsSchema = Joi.object({
  donationAmount: Joi.number().min(0).optional().messages({
    "number.min": "Donation amount cannot be negative",
    "number.base": "Donation amount must be a valid number",
  }),

  donationType: Joi.string().valid("cash", "kind", "services", "").optional(),

  anonymous: Joi.boolean().default(false),
});

// Volunteer Details Validation
const volunteerDetailsSchema = Joi.object({
  volunteerRole: Joi.string()
    .valid(
      "coordination",
      "food",
      "decoration",
      "security",
      "photography",
      "other",
      ""
    )
    .optional(),

  availability: Joi.string()
    .valid("morning", "afternoon", "full-day", "")
    .optional(),

  skills: Joi.string().max(200).optional().messages({
    "string.max": "Skills description cannot exceed 200 characters",
  }),

  experience: Joi.string()
    .valid("beginner", "intermediate", "experienced", "")
    .optional(),
});

// Passport Details Validation
const passportDetailsSchema = Joi.object({
  passportNumber: Joi.string().trim().max(50).optional().messages({
    "string.max": "Passport number cannot exceed 50 characters",
  }),

  passportCountry: Joi.string().trim().max(100).optional(),

  studentId: Joi.string().trim().max(50).optional().messages({
    "string.max": "Student ID cannot exceed 50 characters",
  }),

  university: Joi.string().trim().max(100).optional().messages({
    "string.max": "University name cannot exceed 100 characters",
  }),

  graduationYear: Joi.number()
    .integer()
    .min(1990)
    .max(new Date().getFullYear() + 1)
    .optional()
    .messages({
      "number.min": "Graduation year cannot be before 1990",
      "number.max": "Graduation year cannot be in the future",
      "number.base": "Graduation year must be a valid number",
    }),
});

// Payment Validation
const paymentSchema = {
  contributionAmount: Joi.number().min(0).required().messages({
    "number.min": "Contribution amount cannot be negative",
    "number.base": "Contribution amount must be a valid number",
    "any.required": "Contribution amount is required",
  }),

  proposedAmount: Joi.number().min(0).required().messages({
    "number.min": "Proposed amount cannot be negative",
    "number.base": "Proposed amount must be a valid number",
    "any.required": "Proposed amount is required",
  }),

  paymentTransactionId: Joi.string().trim().required().messages({
    "string.empty": "Payment transaction ID is required",
    "any.required": "Payment transaction ID is required",
  }),
};

// Main Registration Validation Schema
const createRegistrationSchema = Joi.object({
  // Personal Details
  ...personalDetailsSchema,

  // Registration Types
  registrationTypes: registrationTypesSchema,

  // Event Preferences
  ...eventPreferencesSchema,

  // Additional Categories
  sponsorshipDetails: sponsorshipDetailsSchema.default({}),
  donationDetails: donationDetailsSchema.default({}),
  volunteerDetails: volunteerDetailsSchema.default({}),
  passportDetails: passportDetailsSchema.default({}),

  // Payment Information
  ...paymentSchema,

  // Optional Fields
  notes: Joi.string().max(500).optional().messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),
});

// Update Registration Schema (all fields optional except _id)
const updateRegistrationSchema = Joi.object({
  // Personal Details
  name: personalDetailsSchema.name,
  email: personalDetailsSchema.email,
  whatsappNumber: personalDetailsSchema.whatsappNumber,
  gender: personalDetailsSchema.gender,
  country: personalDetailsSchema.country,
  stateUT: personalDetailsSchema.stateUT,
  district: personalDetailsSchema.district,
  yearOfPassing: personalDetailsSchema.yearOfPassing,
  houseColor: personalDetailsSchema.houseColor.optional(),

  // Registration Types
  registrationTypes: Joi.array()
    .items(
      Joi.string().valid(
        "attendee",
        "sponsor",
        "donor",
        "volunteer",
        "passout-student"
      )
    )
    .min(1)
    .optional(),

  // Event Preferences
  isAttending: eventPreferencesSchema.isAttending,
  attendees: attendeesSchema.optional(),
  eventParticipation: eventPreferencesSchema.eventParticipation,
  participationDetails: eventPreferencesSchema.participationDetails,
  traditionalDress: eventPreferencesSchema.traditionalDress,
  culturalProgram: eventPreferencesSchema.culturalProgram,
  programType: eventPreferencesSchema.programType,
  flowerArrangement: eventPreferencesSchema.flowerArrangement,
  pookalamSize: eventPreferencesSchema.pookalamSize,

  // Additional Categories
  sponsorshipDetails: sponsorshipDetailsSchema,
  donationDetails: donationDetailsSchema,
  volunteerDetails: volunteerDetailsSchema,
  passportDetails: passportDetailsSchema,

  // Payment Information
  contributionAmount: paymentSchema.contributionAmount.optional(),
  proposedAmount: paymentSchema.proposedAmount.optional(),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .optional(),
  paymentTransactionId: paymentSchema.paymentTransactionId.optional(),

  // Status Fields
  status: Joi.string().valid("active", "cancelled", "completed").optional(),
  verified: Joi.boolean().optional(),
  notes: Joi.string().max(500).optional(),
});

// Query Parameters Validation
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid("registrationDate", "name", "email", "contributionAmount")
    .default("registrationDate"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  status: Joi.string().valid("active", "cancelled", "completed").optional(),
  paymentStatus: Joi.string()
    .valid("pending", "completed", "failed", "refunded")
    .optional(),
  verified: Joi.boolean().optional(),
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
