const { UnauthenticatedError } = require("../errors");

/**
 * This function is used to check if the user is a super admin or not. If the user is
 * not a super admin, it throws an error.
 */
const isSuper = (req, res, next) => {
  if (!req.user.isAdmin || !req.user.isSuper) {
    throw new UnauthenticatedError("User cannot access this resource");
  }
  next();
};

module.exports = isSuper;
