const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const token = jwt.sign({ id: user._id }, "asd#@#@Das", {
      expiresIn: 5 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


//seed users
const seedUsers = async () => {
  const users = await User.find();
  if (users.length === 0) {
    //bcrypt password
    const hashedPassword = await bcrypt.hash("UnMA@3421g", 10);
    const user = await User.create({ username: "unma-banglore-admin", password: hashedPassword });
    console.log("User seeded successfully", user);
  } else {
    console.log("Users already seeded");
  }
};

seedUsers();

module.exports = {
  login
  
};
