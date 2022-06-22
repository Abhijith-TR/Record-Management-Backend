const { StatusCodes } = require("http-status-codes");

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Access Denied" });
  }
  next();
};

module.exports = isAdmin;
