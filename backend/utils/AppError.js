//This class lets you create structured errors with status codes instead of plain errors.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor); //A stack trace is a report that shows where an error happened in your code and the sequence of function calls that led to it.
  }
}

module.exports = AppError;
