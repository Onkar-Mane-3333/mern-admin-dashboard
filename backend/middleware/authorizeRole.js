const AppError = require("../utils/AppError");

function authorizeRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
}

module.exports = authorizeRole;
