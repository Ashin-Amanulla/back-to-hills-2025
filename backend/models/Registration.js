const mongoose = require("mongoose");

// Back to Hills 4.0 Alumni Meet Registration Schema
const registrationSchema = new mongoose.Schema(
  {
    // Basic Personal Information
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    batch: {
      type: String,
      required: [true, "Batch is required"],
      enum: [
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
        "Batch 32",
      ],
    },

    // Event Preferences
    foodChoice: {
      type: String,
      required: [true, "Food choice is required"],
      enum: ["Veg", "Non-Veg"],
    },
    expectedArrivalTime: {
      type: String,
      required: [true, "Expected arrival time is required"],
      enum: ["8-11", "11-14", "14-17", "17-20"],
    },
    overnightAccommodation: {
      type: String,
      required: [true, "Overnight accommodation preference is required"],
      enum: ["Yes", "No"],
    },

    // Attendees
    attendees: {
      adults: { type: Number, default: 0 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },

    // Guest Information
    guests: [
      {
        name: {
          type: String,
          required: true,
        },
        gender: {
          type: String,
          required: true,
          enum: ["Male", "Female", "Other"],
        },
        foodChoice: {
          type: String,
          required: true,
          enum: ["Veg", "Non-Veg"],
        },
        ageCategory: {
          type: String,
          required: true,
          enum: ["Adult", "Child", "Infant"],
        },
      },
    ],

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
    isEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
registrationSchema.index({ email: 1 });
registrationSchema.index({ paymentTransactionId: 1 });
registrationSchema.index({ batch: 1 });

// Virtual for registration ID
registrationSchema.virtual("registrationId").get(function () {
  return `BTH4${this._id.toString().slice(-8).toUpperCase()}`;
});

// Virtual for total attendees (including guests)
registrationSchema.virtual("totalAttendees").get(function () {
  const primaryAttendees =
    (this.attendees?.adults || 0) +
    (this.attendees?.children || 0) +
    (this.attendees?.infants || 0);
  const guestCount = this.guests ? this.guests.length : 0;
  return primaryAttendees + guestCount;
});

// Virtual to check if batch gets free registration
registrationSchema.virtual("isFreeBatch").get(function () {
  return (
    this.batch &&
    ["Batch 28", "Batch 29", "Batch 30", "Batch 31", "Batch 32"].includes(
      this.batch
    )
  );
});

// Method to calculate total amount
registrationSchema.methods.calculateTotalAmount = function () {
  const batchNumber = parseInt(this.batch.split(" ")[1]);
  const isFreeBatch = batchNumber >= 28 && batchNumber <= 32;

  let total = 0;

  // Primary registrant pricing
  if (isFreeBatch) {
    // Free for primary registrant
    total += 0;
  } else {
    // Rs 300 for primary registrant (1 adult)
    total += 300;
  }

  // Additional adults
  const additionalAdults = Math.max((this.attendees?.adults || 0) - 1, 0);
  total += additionalAdults * 200;

  // Children (6-17)
  total += (this.attendees?.children || 0) * 150;

  // Infants are free
  // (this.attendees?.infants || 0) * 0 = 0

  return total;
};

// Static method to get statistics
registrationSchema.statics.getStatistics = async function () {
  const totalRegistrations = await this.countDocuments();
  const totalAmount = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$contributionAmount" },
      },
    },
  ]);

  const paymentStatusStats = await this.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const verifiedStats = await this.aggregate([
    {
      $group: {
        _id: "$verified",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalRegistrations,
    totalAmount: totalAmount[0]?.total || 0,
    paymentStatusDistribution: paymentStatusStats,
    verificationStatus: verifiedStats,
  };
};

module.exports = mongoose.model("Registration", registrationSchema);
