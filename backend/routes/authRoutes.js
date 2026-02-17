//This file defines your authentication routes, specifically the POST /login route with validation.

const express = require("express");
const { body } = require("express-validator");
const { login, register } = require("../controllers/authController");

const router = express.Router(); //is used to create a mini-router for handling routes in a separate file instead of putting everything in app.js or server.js.

//router.post(path, middleware1, middleware2, controller) it is syntax. A controller is just a function that handles the request and sends a response.

router.post(
  "/login",
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 4 }),
  login
);

module.exports = router;

router.post("/register", register);
