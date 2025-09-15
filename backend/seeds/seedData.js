const Registration = require("../models/Registration");

const sampleRegistrations = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    whatsappNumber: "9876543210",
    age: 25,
    gender: "male",
    country: "IN",
    stateUT: "Kerala",
    district: "Thiruvananthapuram",
    city: "Thiruvananthapuram",
    pincode: "695001",
    location: "Bangalore",
    yearOfPassing: 2020,
    houseColor: "red",
    isAlumni: true,
    alumniVerification: true,
    registrationTypes: ["attendee", "volunteer"],
    isAttending: true,
    attendees: {
      adults: 2,
      children: 1,
      infants: 0,
    },
    eventParticipation: ["pookalam", "cultural"],
    participationDetails:
      "Interested in participating in cultural programs and pookalam competition",
    traditionalDress: true,
    culturalProgram: true,
    programType: "folk-dance",
    flowerArrangement: true,
    pookalamSize: "medium",
    volunteerDetails: {
      volunteerRole: "coordination",
      availability: "full-day",
      skills: "Event management and coordination",
      experience: "experienced",
    },
    contributionAmount: 1900,
    proposedAmount: 1900,
    paymentStatus: "completed",
    paymentTransactionId: "TXN123456789",
    verified: true,
    verificationDate: new Date(),
    verifiedBy: "Admin",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    whatsappNumber: "8765432109",
    age: 28,
    gender: "female",
    country: "IN",
    stateUT: "Kerala",
    district: "Kochi",
    city: "Kochi",
    pincode: "682001",
    location: "Bangalore",
    yearOfPassing: 2018,
    houseColor: "blue",
    isAlumni: true,
    alumniVerification: true,
    registrationTypes: ["attendee", "sponsor"],
    isAttending: true,
    attendees: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    eventParticipation: ["cultural"],
    participationDetails: "Looking forward to the cultural programs",
    traditionalDress: true,
    culturalProgram: true,
    programType: "classical-dance",
    flowerArrangement: false,
    sponsorshipDetails: {
      enterpriseName: "Tech Solutions Pvt Ltd",
      sponsorshipLevel: "silver",
      sponsorshipAmount: 5000,
      contactPerson: "Jane Smith",
      phoneNumber: "8765432109",
      email: "jane.smith@example.com",
    },
    contributionAmount: 750,
    proposedAmount: 750,
    paymentStatus: "completed",
    paymentTransactionId: "TXN987654321",
    verified: true,
    verificationDate: new Date(),
    verifiedBy: "Admin",
  },
  {
    name: "Raj Kumar",
    email: "raj.kumar@example.com",
    whatsappNumber: "7654321098",
    age: 22,
    gender: "male",
    country: "IN",
    stateUT: "Kerala",
    district: "Kozhikode",
    city: "Kozhikode",
    pincode: "673001",
    location: "Bangalore",
    yearOfPassing: 2023,
    houseColor: "green",
    isAlumni: true,
    alumniVerification: false,
    registrationTypes: ["attendee", "passout-student"],
    isAttending: true,
    attendees: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    eventParticipation: ["games"],
    participationDetails: "Recent passout student excited to participate",
    traditionalDress: false,
    culturalProgram: false,
    flowerArrangement: false,
    passportDetails: {
      studentId: "STU2023001",
      university: "Kerala University",
      graduationYear: 2023,
    },
    contributionAmount: 400,
    proposedAmount: 400,
    paymentStatus: "pending",
    paymentTransactionId: "TXN456789123",
    verified: false,
  },
  {
    name: "Priya Nair",
    email: "priya.nair@example.com",
    whatsappNumber: "6543210987",
    age: 30,
    gender: "female",
    country: "IN",
    stateUT: "Kerala",
    district: "Thrissur",
    city: "Thrissur",
    pincode: "680001",
    location: "Bangalore",
    yearOfPassing: 2015,
    houseColor: "yellow",
    isAlumni: true,
    alumniVerification: true,
    registrationTypes: ["attendee", "donor"],
    isAttending: true,
    attendees: {
      adults: 2,
      children: 2,
      infants: 1,
    },
    eventParticipation: ["pookalam"],
    participationDetails:
      "Family attending with children, interested in pookalam",
    traditionalDress: true,
    culturalProgram: false,
    flowerArrangement: true,
    pookalamSize: "large",
    donationDetails: {
      donationAmount: 1000,
      donationType: "cash",
      anonymous: false,
    },
    contributionAmount: 2300,
    proposedAmount: 2300,
    paymentStatus: "completed",
    paymentTransactionId: "TXN789123456",
    verified: true,
    verificationDate: new Date(),
    verifiedBy: "Admin",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing registrations
    await Registration.deleteMany({});
    console.log("🗑️  Cleared existing registrations");

    // Insert sample registrations
    const registrations = await Registration.insertMany(sampleRegistrations);
    console.log(`✅ Inserted ${registrations.length} sample registrations`);

    // Display summary
    const stats = await Registration.getStatistics();
    console.log("📊 Registration Statistics:");
    console.log(`   Total Registrations: ${stats.totalRegistrations}`);
    console.log(`   Total Amount: ₹${stats.totalAmount}`);
    console.log(`   Verified: ${stats.verifiedRegistrations}`);
    console.log(`   Pending Payments: ${stats.pendingPayments}`);
    console.log(`   Completed Payments: ${stats.completedPayments}`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    throw error;
  }
};

module.exports = { seedDatabase, sampleRegistrations };
