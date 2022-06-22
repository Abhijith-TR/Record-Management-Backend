const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: [true, "Please enter subject code"],
      minlength: 5,
      uppercase: true,
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
  },
  { timestamps: true }
);

DataSchema.index({ subjectCode: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("Data", DataSchema);
