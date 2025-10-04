const Registration = require("../models/Registration");
const moment = require("moment-timezone");
const { sendSuccessEmail } = require("../utils/email");

// @desc    Create new registration
// @route   POST /api/registrations
// @access  Public
const createRegistration = async (req, res, next) => {
  try {
    // Check if email or mobile already exists
    const existingRegistration = await Registration.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Registration already exists with this email or mobile number",
        existingRegistration: {
          email: existingRegistration.email,
          mobile: existingRegistration.mobile,
          registrationDate: existingRegistration.createdAt,
        },
      });
    }

    // Check if payment transaction ID already exists
    const existingTransaction = await Registration.findOne({
      paymentTransactionId: req.body.paymentTransactionId,
    });

    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: "Payment transaction ID already used",
      });
    }

    // Create registration
    const registration = await Registration.create(req.body);
    let emailResponse = await sendSuccessEmail(registration);
    if (emailResponse.error) {
      registration.isEmailSent = false;
    } else {
      registration.isEmailSent = true;
    }
    await registration.save();
    res.status(201).json({
      success: true,
      message: "Registration created successfully",
      data: {
        registrationId: registration.registrationId,
        id: registration._id,
        name: registration.name,
        email: registration.email,
        totalAttendees: registration.totalAttendees,
        contributionAmount: registration.contributionAmount,
        paymentStatus: registration.paymentStatus,
        registrationDate: registration.registrationDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private (Admin)
const getRegistrations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      paymentStatus,
      verified,
      batch,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (verified !== undefined) filter.verified = verified === "true";
    if (batch) filter.batch = batch;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { batch: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const registrations = await Registration.find(filter)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    // Get total count for pagination
    const total = await Registration.countDocuments(filter);
    //time to IST

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      count: registrations.length,
      pagination: {
        currentPage: page,
        totalPages,
        totalRegistrations: total,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      data: registrations.map((registration) => ({
        ...registration.toObject(), // convert Mongoose doc to plain object
        registrationDate: moment(registration.createdAt)
          .tz("Asia/Kolkata")
          .format("DD-MM-YYYY"),
      })),
    });
  } catch (error) {
    console.error("Error getting registrations:", error);
    next(error);
  }
};

// @desc    Get single registration
// @route   GET /api/registrations/:id
// @access  Private (Admin)
const getRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.json({
      success: true,
      data: registration,
    });
  } catch (error) {
    console.error("Error getting registration:", error);
    next(error);
  }
};

// @desc    Update registration
// @route   PUT /api/registrations/:id
// @access  Private (Admin)
const updateRegistration = async (req, res, next) => {
  try {
    let registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Check for duplicate email/mobile if being updated
    if (req.body.email || req.body.mobile) {
      const existingRegistration = await Registration.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(req.body.email ? [{ email: req.body.email }] : []),
          ...(req.body.mobile ? [{ mobile: req.body.mobile }] : []),
        ],
      });

      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message:
            "Email or mobile number already exists in another registration",
        });
      }
    }

    // Check for duplicate payment transaction ID if being updated
    if (req.body.paymentTransactionId) {
      const existingTransaction = await Registration.findOne({
        _id: { $ne: req.params.id },
        paymentTransactionId: req.body.paymentTransactionId,
      });

      if (existingTransaction) {
        return res.status(400).json({
          success: false,
          message: "Payment transaction ID already used",
        });
      }
    }

    // Update registration
    registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    next(error);
  }
};

// @desc    Delete registration
// @route   DELETE /api/registrations/:id
// @access  Private (Admin)
const deleteRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    next(error);
  }
};

// @desc    Get registration statistics
// @route   GET /api/registrations/stats/summary
// @access  Private (Admin)
const getRegistrationStats = async (req, res, next) => {
  try {
    const stats = await Registration.getStatistics();

    // Additional statistics for Back to Hills 4.0
    const batchStats = await Registration.aggregate([
      {
        $group: {
          _id: "$batch",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const foodChoiceStats = await Registration.aggregate([
      {
        $group: {
          _id: "$foodChoice",
          count: { $sum: 1 },
        },
      },
    ]);

    const arrivalTimeStats = await Registration.aggregate([
      {
        $group: {
          _id: "$expectedArrivalTime",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const accommodationStats = await Registration.aggregate([
      {
        $group: {
          _id: "$overnightAccommodation",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        batchDistribution: batchStats,
        foodChoices: foodChoiceStats,
        arrivalTimes: arrivalTimeStats,
        accommodationPreferences: accommodationStats,
      },
    });
  } catch (error) {
    console.error("Error getting registration stats:", error);
    next(error);
  }
};

// @desc    Verify registration
// @route   PATCH /api/registrations/:id/verify
// @access  Private (Admin)
const verifyRegistration = async (req, res, next) => {
  try {
    const { verifiedBy } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    registration.verified = !registration.verified;
    registration.verificationDate = new Date();
    registration.verifiedBy = verifiedBy || "Admin";

    await registration.save();

    res.json({
      success: true,
      message: `Registration ${
        registration.verified ? "verified" : "unverified"
      } successfully`,
      data: {
        id: registration._id,
        verified: registration.verified,
        verificationDate: registration.verificationDate,
        verifiedBy: registration.verifiedBy,
      },
    });
  } catch (error) {
    console.error("Error verifying registration:", error);
    next(error);
  }
};

// @desc    Update payment status
// @route   PATCH /api/registrations/:id/payment
// @access  Private (Admin)
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentTransactionId } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Check for duplicate payment transaction ID if being updated
    if (
      paymentTransactionId &&
      paymentTransactionId !== registration.paymentTransactionId
    ) {
      const existingTransaction = await Registration.findOne({
        _id: { $ne: req.params.id },
        paymentTransactionId: paymentTransactionId,
      });

      if (existingTransaction) {
        return res.status(400).json({
          success: false,
          message: "Payment transaction ID already used",
        });
      }
    }

    registration.paymentStatus = paymentStatus || registration.paymentStatus;
    if (paymentTransactionId) {
      registration.paymentTransactionId = paymentTransactionId;
    }

    // Auto-verify if payment is completed
    if (registration.paymentStatus === "completed" && !registration.verified) {
      registration.verified = true;
      registration.verificationDate = new Date();
    }

    await registration.save();

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: {
        id: registration._id,
        paymentStatus: registration.paymentStatus,
        paymentTransactionId: registration.paymentTransactionId,
        verified: registration.verified,
      },
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    next(error);
  }
};

// @desc    Search registrations by transaction ID or email
// @route   GET /api/registrations/search/:query
// @access  Public (for self-check)
const searchRegistration = async (req, res, next) => {
  try {
    const { query } = req.params;

    // Search by transaction ID or email
    const registration = await Registration.findOne({
      $or: [{ paymentTransactionId: query }, { email: query.toLowerCase() }],
    }).select("-__v");

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.json({
      success: true,
      data: {
        registrationId: registration.registrationId,
        name: registration.name,
        email: registration.email,
        mobile: registration.mobile,
        batch: registration.batch,
        totalAttendees: registration.totalAttendees,
        contributionAmount: registration.contributionAmount,
        paymentStatus: registration.paymentStatus,
        verified: registration.verified,
        registrationDate: registration.createdAt,
        foodChoice: registration.foodChoice,
        expectedArrivalTime: registration.expectedArrivalTime,
        overnightAccommodation: registration.overnightAccommodation,
      },
    });
  } catch (error) {
    console.error("Error searching registration:", error);
    next(error);
  }
};

// @desc    Download registrations as Excel
// @route   GET /api/registrations/download
// @access  Private (Admin)
const downloadRegistrations = async (req, res, next) => {
  try {
    const XLSX = require("xlsx");

    // Fetch all registrations
    const registrations = await Registration.find().select("-__v -_id").lean();

    // Transform data for Excel
    const excelData = registrations.map((reg) => ({
      "Registration ID": reg.registrationId,
      Name: reg.name,
      Email: reg.email,
      "Mobile Number": reg.mobile,
      Gender: reg.gender,
      Batch: reg.batch,
      "Food Choice": reg.foodChoice,
      "Expected Arrival Time": reg.expectedArrivalTime,
      "Overnight Accommodation": reg.overnightAccommodation,
      Adults: reg.attendees?.adults || 0,
      Children: reg.attendees?.children || 0,
      Infants: reg.attendees?.infants || 0,
      "Total Attendees":
        (reg.attendees?.adults || 0) +
        (reg.attendees?.children || 0) +
        (reg.attendees?.infants || 0),
      "Guest Count": reg.guests?.length || 0,
      "Contribution Amount": reg.contributionAmount,
      "Payment Status": reg.paymentStatus,
      "Transaction ID": reg.paymentTransactionId,
      Verified: reg.verified ? "Yes" : "No",
      "Registration Date": new Date(reg.createdAt).toLocaleDateString(),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=registrations.xlsx"
    );

    // Send file
    res.send(buffer);
  } catch (error) {
    console.error("Error downloading registrations:", error);
      next(error);
  }
};

//sent confirmation email to isEmailSent is false
const sendConfirmationEmail = async (req, res, next) => {
  try {
    console.log("Sending confirmation emails");
    const registrations = await Registration.find({ isEmailSent: false });
    console.log(`${registrations.length} registrations found`);
    for (const registration of registrations) {
      await sendSuccessEmail(registration);
      registration.isEmailSent = true;
      await registration.save();
      console.log(`${registration.name} email sent`);
    }
    res.json({
      success: true,
      message: "Confirmation emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending confirmation emails:", error);
    res.status(500).json({
      success: false,
      message: "Error sending confirmation emails",
    });
  }
};

module.exports = {
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
};
