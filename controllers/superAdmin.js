const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const Admin = require("../models/admin");

module.exports = {
  registerSuper,
};
