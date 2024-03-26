const CourseName = require("../models/courseName");
const Data = require("../models/data");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  ForbiddenError,
} = require("../errors");

/**
 * This function is used to get records. It checks if the subject code is valid
 * and if it is, it returns all the records for that subject code. Only the admin
 * is allowed to access all the records. The user is only allowed to access his
 * own records.
*/
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
    .select("subjectCode subjectName grade entryNumber semester");
  records = records.map((item) => {
    const { subjectCode, subjectName, grade, entryNumber, semester } = item;
    return { subjectCode, subjectName, grade, entryNumber, semester };
  });
  res.status(StatusCodes.OK).json({
    msg: "Records returned",
    records,
    number: records.length,
  });
};

/**
 * This function is used to get a single record. It checks if the entry number is
 * valid and if it is, it returns all the records for that entry number. Only the
 * admin is allowed to access all the records. The user is only allowed to access
 * his own records.
*/
const showSingleRecord = async (req, res) => {
  let { entryNumber } = req.params;
  entryNumber = entryNumber.toUpperCase();
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

/**
 * This function is used to update a record. It checks if the entry number and
 * subject code are valid and if they are, it updates the grade of the record.
 * Only the admin who created the record is allowed to update it.
*/
const updateRecord = async (req, res) => {
  let { entryNumber, subjectCode } = req.params;
  const { grade } = req.body;
  entryNumber = entryNumber.toUpperCase();
  subjectCode = subjectCode.toUpperCase();
  if (!entryNumber || !subjectCode) {
    throw new BadRequestError("Invalid entry number or subject code");
  }
  const check = await Data.findOne({ entryNumber, subjectCode });
  if (!check) {
    throw new NotFoundError("No such record found to update");
  }
  if (!req.user.isSuper && check.createdBy.toString() !== req.user.adminId) {
    throw new ForbiddenError("Cannot modify record inserted by another user");
  }
  const data = await Data.findOneAndUpdate(
    { entryNumber, subjectCode },
    { grade },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ msg: "Record updated" });
};

/**
 * This function is used to delete a record. It checks if the entry number and
 * subject code are valid and if they are, it deletes the record. Only the admin
 * who created the record is allowed to delete it.
*/
const deleteRecord = async (req, res) => {
  let { entryNumber, subjectCode } = req.params;
  entryNumber = entryNumber.toUpperCase();
  subjectCode = subjectCode.toUpperCase();
  if (!entryNumber || !subjectCode) {
    throw new BadRequestError("Enter valid entry number and subject code");
  }
  const check = await Data.findOne({ entryNumber, subjectCode });
  if (!check) {
    throw new NotFoundError("No such record found to delete");
  }
  if (!req.user.isSuper && check.createdBy.toString() !== req.user.adminId) {
    throw new ForbiddenError("Cannot modify record inserted by another user");
  }
  const data = await Data.deleteOne({ entryNumber, subjectCode });
  res.status(StatusCodes.OK).json({ msg: "Successfully deleted record" });
};

/**
 * This function is used to delete all records. It checks if the subject code is
 * valid and if it is, it deletes all the records for that subject code. Only the
 * super admin is allowed to delete all the records.
*/
const deleteAllRecord = async (req, res) => {
  let { subjectCode } = req.params;
  subjectCode = subjectCode.toUpperCase();
  if (!subjectCode) {
    throw new BadRequestError("Invalid subject code");
  }
  const data = await Data.deleteMany({ subjectCode });
  if (data.deletedCount === 0) {
    throw new NotFoundError("No records with given specifications");
  }
  res.status(StatusCodes.OK).json({
    msg: "Successfully deleted records",
    deleteCount: data.deletedCount,
  });
};

/**
 * This function is used to create a record. It checks if the subject code, grade
 * and entry number are valid and if they are, it creates a new record. It also
 * checks if the subject code and entry number exist in the database.
*/
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

/**
 * This function is used to create a subject. It checks if the subject name and
 * subject code are valid and if they are, it creates a new subject.
*/
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
