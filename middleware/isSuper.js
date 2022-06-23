const { UnauthenticatedError } = require("../errors");

// middleware checks if the user is an admin
// prevents requests from going through if the user is not an admin
const isSuper = (req, res, next) => {
  if (!req.user.isAdmin || !req.user.isSuper) {
    throw new UnauthenticatedError("User cannot access this resource");
  }
  next();
};

module.exports = isSuper;
