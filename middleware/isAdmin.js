const { StatusCodes } = require("http-status-codes");
const { ForbiddenError } = require("../errors");

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new ForbiddenError("User cannot access this resource");
  }
  next();
};

module.exports = isAdmin;
