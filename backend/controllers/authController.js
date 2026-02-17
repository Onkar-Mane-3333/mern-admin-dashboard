const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const AppError = require("../utils/AppError");


const SECRET_KEY = "mysecretkey";

//validationResult(req) collects the errors produced by express-validator middleware for the current request.
// exports.login = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return next(new AppError(errors.array()[0].msg, 400));
//   }

//   const { email, password } = req.body;

//   let role = "user";
//   if (email === "admin@gmail.com") role = "admin";
//   if (email === "manager@gmail.com") role = "manager";

//   if (
//     password === "1234" &&
//     ["admin@gmail.com", "manager@gmail.com", "user@gmail.com"].includes(email)
//   ) {
//     const token = jwt.sign({ email, role }, SECRET_KEY, {
//       expiresIn: "1h",
//     });

//     return res.json({ token });
//   }

//   next(new AppError("Invalid credentials", 401));
// };

// new with mongodb authentication
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password required", 400));
    }

    // find user in database
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    // compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    // create JWT
    const token = jwt.sign(
      { email: user.email, role: user.role },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    next(err);
  }
};


// This controller registers a new user by validating input, hashing the password, saving the user in MongoDB, and returning a response.
exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password required", 400));
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    // hash password.Salt rounds (10) tell bcrypt how many times to process the password during hashing to make it more secure.
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || "user"
    });

    res.status(201).json({
      message: "User registered",
      user: {
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};
