const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Please enter subject code"],
      minlength: 5,
    },
    announcement: {
      type: String,
      required: [true, "Please enter announcement"],
      minlength: 5,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: [true, "Please enter the notifier"],
    },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ subjectCode: 1, announcement: 1 }, { unique: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);
