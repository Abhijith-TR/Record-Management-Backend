const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class ForbiddenError extends CustomError {
  constructor(message) {
    this.message = message;
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
