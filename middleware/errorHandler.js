const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.message.includes("duplicate")) {
    err.message = "Duplicate record detected";
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "Duplicate / Invalid Entry" });
};

module.exports = errorHandler;
