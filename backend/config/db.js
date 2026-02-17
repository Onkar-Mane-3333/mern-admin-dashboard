//This file creates and exports a function that connects your Node.js app to a local MongoDB database using Mongoose.

const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect("mongodb://127.0.0.1:27017/auth_demo")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
}

module.exports = connectDB;
