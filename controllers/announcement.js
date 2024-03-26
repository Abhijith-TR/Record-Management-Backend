const { BadRequestError, NotFoundError, ForbiddenError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Announcement = require("../models/announcements");
const CourseName = require("../models/courseName");
const Data = require("../models/data");

/**
 * This function is used to post an announcement. It checks if the announcement
 * and subject code are valid and if they are, it creates a new announcement with
 * the given announcement and subject code.
 */
const postAnnouncement = async (req, res) => {
  const { adminId } = req.user;
  const { announcement, subjectCode } = req.body;
  if (!announcement || !subjectCode) {
    throw new BadRequestError("Please enter valid credentials");
  }
  const subject = await CourseName.findOne({ subjectCode });
  if (!subject) {
    throw new NotFoundError("Subject does not exist");
  }
  await Announcement.create({
    subjectCode,
    announcement,
    createdBy: adminId,
  });
  res.status(StatusCodes.CREATED).send({ msg: "Announcement Created" });
};

/**
 * This function is used to get announcements. It checks if the subject code is 
 * valid and if it is, it returns all the announcements for that subject code. 
 * If the user is not an admin, he is only allowed to access notifications if he
 * is currently enrolled i.e., his grade in the course is '-'
 */
const getAnnouncements = async (req, res) => {
  const { subjectCode } = req.params;
  if (!subjectCode) {
    throw new BadRequestError("Enter valid subject code");
  }
  const subject = await CourseName.findOne({ subjectCode });
  if (!subject) {
    throw new NotFoundError("Subject does not exist");
  }
  if (!req.user.isAdmin) {
    const data = await Data.find({
      entryNumber: req.user.entryNumber,
      subjectCode,
      grade: "-",
    });
    if (data.length === 0) {
      throw new ForbiddenError("Cannot access records for unenrolled courses");
    }
  }
  let notif = await Announcement.find({ subjectCode })
    .sort("createdAt")
    .select("subjectCode announcement");
  res.status(StatusCodes.OK).send({
    msg: "Announcements returned",
    notifications: notif,
    number: notif.length,
  });
};

/**
 * This function is used to remove an announcement. It checks if the subject code
 * and id are valid and if they are, it deletes the announcement with the given
 * id. If the user is not a super admin, he is only allowed to delete the
 * announcements he has created.
 */
const removeAnnouncement = async (req, res) => {
  let { subjectCode, id } = req.params;
  subjectCode = subjectCode.toUpperCase();
  if (!subjectCode || !id) {
    throw new BadRequestError("Invalid subject code / id");
  }
  const check = await Announcement.find({
    _id: id,
    createdBy: req.user.adminId,
  });
  if (!req.user.isSuper && check.length == 0) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ msg: "User cannot delete this announcement" });
  }
  await Announcement.deleteOne({ _id: id });
  res.status(StatusCodes.OK).send({ msg: "Announcement deleted" });
};

module.exports = {
  postAnnouncement,
  removeAnnouncement,
  getAnnouncements,
};
