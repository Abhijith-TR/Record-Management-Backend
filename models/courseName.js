const mongoose = require("mongoose");

const CourseNameSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: [true, "Please enter course code"],
    uppercase: true,
    unique: true,
    minlength: 5,
  },
  subjectName: {
    type: String,
    required: [true, "Please enter course name"],
    unique: true,
    minlength: 2,
  },
});

CourseNameSchema.pre("save", function () {
  let name = this.subjectName.split(" ");
  name = name.map(
    (item) => item[0].toUpperCase() + item.slice(1).toLowerCase()
  );
  name = name.join(" ");
  this.subjectName = name;
});

module.exports = mongoose.model("CourseName", CourseNameSchema);
