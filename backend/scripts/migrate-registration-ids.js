const mongoose = require("mongoose");
const Registration = require("../models/Registration");
require("dotenv").config();

const migrateRegistrationIds = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all registrations without registrationId
    const registrationsWithoutId = await Registration.find({
      $or: [{ registrationId: null }, { registrationId: { $exists: false } }],
    });

    console.log(
      `Found ${registrationsWithoutId.length} registrations without registration ID`
    );

    // Update each registration
    for (const registration of registrationsWithoutId) {
      registration.registrationId = `BTH4${registration._id
        .toString()
        .slice(-8)
        .toUpperCase()}`;
      await registration.save();
      console.log(
        `Updated ${registration.name} - ID: ${registration.registrationId}`
      );
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateRegistrationIds();
