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
      $or: [
        { email: req.body.email },
        { whatsappNumber: req.body.whatsappNumber },
      ],
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Registration already exists with this email or mobile number",
        existingRegistration: {
          email: existingRegistration.email,
          whatsappNumber: existingRegistration.whatsappNumber,
          registrationDate: existingRegistration.registrationDate,
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
    await sendSuccessEmail(registration);
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
      sortBy = "registrationDate",
      sortOrder = "desc",
      status,
      paymentStatus,
      verified,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (verified !== undefined) filter.verified = verified === "true";

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { whatsappNumber: { $regex: search, $options: "i" } },
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
    if (req.body.email || req.body.whatsappNumber) {
      const existingRegistration = await Registration.findOne({
        _id: { $ne: req.params.id },
        $or: [
          ...(req.body.email ? [{ email: req.body.email }] : []),
          ...(req.body.whatsappNumber
            ? [{ whatsappNumber: req.body.whatsappNumber }]
            : []),
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
    next(error);
  }
};

// @desc    Get registration statistics
// @route   GET /api/registrations/stats/summary
// @access  Private (Admin)
const getRegistrationStats = async (req, res, next) => {
  try {
    const stats = await Registration.getStatistics();

    // Additional statistics
    const registrationTypesStats = await Registration.aggregate([
      {
        $unwind: "$registrationTypes",
      },
      {
        $group: {
          _id: "$registrationTypes",
          count: { $sum: 1 },
        },
      },
    ]);

    const houseColorStats = await Registration.aggregate([
      {
        $group: {
          _id: "$houseColor",
          count: { $sum: 1 },
        },
      },
    ]);

    const districtStats = await Registration.aggregate([
      {
        $match: { district: { $exists: true, $ne: "" } },
      },
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        registrationTypes: registrationTypesStats,
        houseColors: houseColorStats,
        topDistricts: districtStats,
      },
    });
  } catch (error) {
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
        whatsappNumber: registration.whatsappNumber,
        totalAttendees: registration.totalAttendees,
        contributionAmount: registration.contributionAmount,
        paymentStatus: registration.paymentStatus,
        verified: registration.verified,
        registrationDate: registration.registrationDate,
        houseColor: registration.houseColor,
        district: registration.district,
      },
    });
  } catch (error) {
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
      "WhatsApp Number": reg.whatsappNumber,
      Gender: reg.gender,
      "State/UT": reg.stateUT,
      District: reg.district,
      "House Color": reg.houseColor,
      "Year of Passing": reg.yearOfPassing,
      "Registration Types": reg.registrationTypes.join(", "),
      Adults: reg.attendees?.adults || 0,
      Children: reg.attendees?.children || 0,
      Infants: reg.attendees?.infants || 0,
      "Total Attendees":
        (reg.attendees?.adults || 0) +
        (reg.attendees?.children || 0) +
        (reg.attendees?.infants || 0),
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
    next(error);
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
};
