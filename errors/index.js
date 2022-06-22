const BadRequestError = require("./BadRequest");
const CustomError = require("./CustomError");
const UnauthenticatedError = require("./Unauthenticated");
const NotFoundError = require("./NotFound");
const ForbiddenError = require("./Forbidden");

module.exports = {
  BadRequestError,
  CustomError,
  UnauthenticatedError,
  NotFoundError,
  ForbiddenError,
};
