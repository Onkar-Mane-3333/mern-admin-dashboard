//This file creates and exports a function that connects your Node.js app to a local MongoDB database using Mongoose.

const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.log(err));
}

module.exports = connectDB;
