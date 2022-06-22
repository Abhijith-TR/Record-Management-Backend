const { ForbiddenError } = require("../errors");

const isUser = (req, res, next) => {
  if (req.user.isAdmin) {
    throw new ForbiddenError("User cannot access this resource");
  }
  next();
};

module.exports = isUser;
