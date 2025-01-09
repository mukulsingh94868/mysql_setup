const db = require("../db");

// Insert a new user into the database
const createUser = (name, email, hashedPassword, phone, callback) => {
  const query =
    "INSERT INTO students (name, email, password, phone) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, phone], callback);
};

// Find a user by email
const findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM students WHERE email = ?";
  db.query(query, [email], callback);
};

const getAllUsers = (callback) => {
  const query = "SELECT * FROM students";
  db.query(query, callback);
};

module.exports = { createUser, findUserByEmail, getAllUsers };
