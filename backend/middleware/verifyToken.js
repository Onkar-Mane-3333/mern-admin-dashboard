//verifyToken middleware checks the JWT token, attaches user data to req.user, and blocks unauthorized requests.

const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const SECRET_KEY = "mysecretkey";

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Token missing", 403));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid token", 401));
    }

    req.user = decoded; //decoded is the payload inside the JWT token after verification.
    next();
  });
}

module.exports = verifyToken;
