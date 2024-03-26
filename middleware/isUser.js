const { UnauthenticatedError } = require("../errors");

/**
 * This function is used to check if the user is a student or not. If the user is
 * not a student, it throws an error.
 */
const isUser = (req, res, next) => {
  if (req.user.isAdmin) {
    throw new UnauthenticatedError("User cannot access this resource");
  }
  next();
};

module.exports = isUser;
