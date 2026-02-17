function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Server Error",
  });
}

module.exports = errorHandler;
