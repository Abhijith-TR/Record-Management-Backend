const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: [true, "Please enter subject code"],
    minlength: 3,
    uppercase: true,
  },
  subjectName: {
    type: String,
    required: [true, "Please enter course name"],
    minlength: 3,
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
  semester: {
    type: Number,
    required: [true, "Please provide the semester"],
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
  },
});

DataSchema.index({ subjectCode: 1, entryNumber: 1 }, { unique: true });

module.exports = mongoose.model("Data", DataSchema);
