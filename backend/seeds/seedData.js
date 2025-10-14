const User = require("../models/User");
const bcrypt = require("bcryptjs");

const sampleAdmin = {
  username: "btth.jnvcan@gmail.com",
  password: "btth@2025",
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing users
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    // Hash the password
    const hashedPassword = await bcrypt.hash(sampleAdmin.password, 10);

    // Create admin user with hashed password
    const adminUser = await User.create({
      username: sampleAdmin.username,
      password: hashedPassword,
    });

    console.log(`✅ Created admin user: ${adminUser.username}`);
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    throw error;
  }
};

module.exports = { seedDatabase, sampleAdmin };
