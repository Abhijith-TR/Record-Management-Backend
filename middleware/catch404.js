const { StatusCodes } = require("http-status-codes");

const handleMissingRoute = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "No such route exists" });
};

module.exports = handleMissingRoute;
