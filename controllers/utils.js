const CourseName = require("../models/courseName");
const Data = require("../models/data");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getData = (entryNumber, subjectCode) => {
  let records = await Data.find({ entryNumber })
    .sort("entryNumber")
    .select("subjectCode subjectName grade entryNumber semester");
  records = records.map((item) => {
    const { subjectCode, subjectName, grade, entryNumber, semester } = item;
    return { subjectCode, subjectName, grade, entryNumber, semester };
  });
}