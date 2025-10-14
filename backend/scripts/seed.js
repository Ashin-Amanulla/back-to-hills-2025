const mongoose = require("mongoose");
const { seedDatabase } = require("../seeds/seedData");
require("dotenv").config();

const seed = async () => {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/btth-registration"
    );
    console.log("✅ Connected to database");

    await seedDatabase();

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
