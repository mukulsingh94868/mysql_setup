const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../modal/userModal");
require("dotenv").config();

// Registration Controller
const register = async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;

  if (!name || !email || !password || !confirmPassword || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  userModel.createUser(name, email, hashedPassword, phone, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists." });
      }
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(201).json({ message: "User registered successfully." });
  });
};

// Login Controller
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  userModel.findUserByEmail(email, async (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful.", token });
  });
};


const getAllUsers = (req, res) => {
  userModel.getAllUsers((err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error.", error: err });
    res.status(200).json(results);
  });
}

module.exports = { register, login, getAllUsers };
