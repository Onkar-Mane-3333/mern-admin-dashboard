//This code defines a User model using Mongoose, which tells MongoDB how user data should look and be stored.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);


// This creates a Mongoose model named "User".
// A model is used to:
// create users
// read users
// update users
// delete users

// MongoDB collection name becomes:
// users

