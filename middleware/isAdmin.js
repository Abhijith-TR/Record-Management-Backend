const { UnauthenticatedError } = require("../errors");

/**
 * This function is used to check if the user is an admin or not. If the user is
 * not an admin, it throws an error.
 */
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new UnauthenticatedError("User cannot access this resource");
  }
  next();
};

module.exports = isAdmin;
