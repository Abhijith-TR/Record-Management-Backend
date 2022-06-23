const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: [true, "Please enter subject code"],
    minlength: 5,
    uppercase: true,
  },
  subjectName: {
    type: String,
    required: [true, "Please enter course name"],
  },
  grade: {
    type: String,
    required: [true, "Please enter grade"],
    enum: [
      "A",
      "A-",
      "B",
      "B-",
      "C",
      "C-",
      "D",
      "E",
      "F",
      "NP",
      "NF",
      "I",
      "W",
      "-",
    ],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
  entryNumber: {
    type: String,
    required: [true, "Please provide entry number"],
    minlength: 11,
    uppercase: true,
  },
});

DataSchema.index({ subjectCode: 1, entryNumber: 1 }, { unique: true });

module.exports = mongoose.model("Data", DataSchema);
