const mongoose = require("mongoose");

// Simple Registration Schema
const registrationSchema = new mongoose.Schema(
  {
    // Basic Personal Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    whatsappNumber: {
      type: String,
      required: [true, "WhatsApp number is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },

    // Location
    stateUT: {
      type: String,
      required: [true, "State/UT is required"],
    },
    otherStateUT: {
      type: String,
    },
    district: {
      type: String,
    },
    houseColor: {
      type: String,
      required: [true, "House color is required"],
      enum: [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "not-sure",
      ],
    },
    yearOfPassing: {
      type: Number,
    },
    isEmailSent:{
      type: Boolean,
      default: false,
    },

    // Registration Details
    registrationTypes: [
      {
        type: String,
        enum: ["attendee", "sponsor", "donor", "volunteer", "passout-student"],
      },
    ],

    // Attendees
    attendees: {
      adults: { type: Number, default: 0 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },

    // Payment
    contributionAmount: {
      type: Number,
      required: [true, "Contribution amount is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentTransactionId: {
      type: String,
      required: [true, "Payment transaction ID is required"],
    },

    // Status
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Simple indexes
registrationSchema.index({ email: 1 });
registrationSchema.index({ paymentTransactionId: 1 });

// Virtual for registration ID
registrationSchema.virtual("registrationId").get(function () {
  return `ONAM${this._id.toString().slice(-8).toUpperCase()}`;
});

// Virtual for total attendees
registrationSchema.virtual("totalAttendees").get(function () {
  return (
    (this.attendees?.adults || 0) +
    (this.attendees?.children || 0) +
    (this.attendees?.infants || 0)
  );
});

module.exports = mongoose.model("Registration", registrationSchema);
