const CourseName = require("../models/courseName");
const Data = require("../models/data");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

// separate from show records for an individual person to prevent
// normal users from accessing this particular route
const showRecords = async (req, res) => {
  let { subjectCode } = req.params;
  subjectCode = subjectCode.toUpperCase();
  if (!subjectCode) {
    throw new BadRequestError("Invalid subject code");
  }
  const subject = await CourseName.findOne({ subjectCode });
  if (!subject) {
    throw new NotFoundError("No such course found");
  }
  let records = await Data.find({ subjectCode })
    .sort("entryNumber")
    .select("subjectCode subjectName grade entryNumber");
  records = records.map((item) => {
    const { subjectCode, subjectName, grade, entryNumber } = item;
    return { subjectCode, subjectName, grade, entryNumber, semester };
  });
  res.status(StatusCodes.OK).json({
    msg: "Records returned",
    records,
    number: records.length,
    semester,
  });
};

const showSingleRecord = async (req, res) => {
  let { entryNumber } = req.params;
  entryNumber = entryNumber.toUpperCase();
  // if this was routed through user and the user is asking for someone elses records, then refuse
  // if it is the admin, allow the request to continue
  if (req.user.isAdmin === false && entryNumber !== req.user.entryNumber) {
    throw new UnauthenticatedError(
      "Unauthorized to access another users records"
    );
  }
  if (!entryNumber) {
    throw new BadRequestError("Invalid entry number");
  }
  const user = await User.findOne({ entryNumber });
  if (!user) {
    throw new NotFoundError("No such user found");
  }
  let records = await Data.find({ entryNumber })
    .sort("entryNumber")
    .select("subjectCode subjectName grade entryNumber semester");
  records = records.map((item) => {
    const { subjectCode, subjectName, grade, entryNumber, semester } = item;
    return { subjectCode, subjectName, grade, entryNumber, semester };
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Records returned", records, number: records.length });
};

const updateRecord = (req, res) => {
  res.send("Update single record");
};

const deleteRecord = (req, res) => {
  res.send("Delete single record");
};

const deleteAllRecord = (req, res) => {
  res.send("Delete all instances of a subject");
};

const createRecord = async (req, res) => {
  const { subjectCode, grade, entryNumber, semester } = req.body;
  if (!subjectCode || !grade || !entryNumber) {
    throw new BadRequestError(
      "Please enter valid code, grade and entry number"
    );
  }
  const subject = await CourseName.findOne({ subjectCode });
  if (!subject) {
    throw new NotFoundError("Please register course before inserting records");
  }
  const user = await User.findOne({ entryNumber });
  if (!user) {
    throw new NotFoundError("Please register user before inserting records");
  }
  const subjectName = subject.subjectName;
  const createdBy = req.user.adminId;
  const record = await Data.create({
    subjectCode,
    grade,
    entryNumber,
    createdBy,
    subjectName,
    semester,
  });
  res.status(StatusCodes.CREATED).send({ msg: "Record Inserted" });
};

const createSubject = async (req, res) => {
  const { subjectName, subjectCode } = req.body;
  if (!subjectName || !subjectCode) {
    throw new BadRequestError("Please enter valid name and subject code");
  }
  const subject = await CourseName.create({ subjectName, subjectCode });
  res.status(StatusCodes.CREATED).send({ msg: "Subject Created" });
};

module.exports = {
  showRecords,
  showSingleRecord,
  updateRecord,
  deleteAllRecord,
  deleteRecord,
  createRecord,
  createSubject,
};
