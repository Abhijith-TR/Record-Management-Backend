const CourseName = require("../models/courseName");
const Data = require("../models/data");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const showRecords = (req, res) => {
  res.send("Show all records");
};

const showSingleRecord = (req, res) => {
  res.send("Show single record");
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
  const { subjectCode, grade, entryNumber } = req.body;
  if (!subjectCode || !grade || !entryNumber) {
    throw new BadRequestError(
      "Please enter valid code, grade and entry number"
    );
  }
  const subject = await CourseName.findOne({ subjectCode });
  if (!subject) {
    throw new BadRequestError(
      "Please register course before inserting records"
    );
  }
  const subjectName = subject.subjectName;
  const createdBy = req.user.adminId;
  const record = await Data.create({
    subjectCode,
    grade,
    entryNumber,
    createdBy,
    subjectName,
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
