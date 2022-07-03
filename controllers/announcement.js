const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Announcement = require("../models/announcements");

const postAnnouncement = async (req, res) => {
  const { adminId } = req.user;
  const { announcement, subjectCode } = req.body;
  if (!announcement || !subjectCode) {
    throw new BadRequestError("Please enter valid credentials");
  }
  await Announcement.create({
    subjectCode,
    announcement,
    createdBy: adminId,
  });
  res.status(StatusCodes.CREATED).send({ msg: "Announcement Created" });
};

const getAnnouncements = async (req, res) => {
  const { subjectCode } = req.params;
  if (!subjectCode) {
    throw new BadRequestError("Enter valid subject code");
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
