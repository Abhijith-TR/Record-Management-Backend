const { UnauthenticatedError } = require("../errors");

// middleware checks if the user is an admin
// prevents requests from going through if the user is not an admin
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new UnauthenticatedError("User cannot access this resource");
  }
  next();
};

module.exports = isAdmin;
