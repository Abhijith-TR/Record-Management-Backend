const mongoose = require("mongoose");

const CourseNameSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: [true, "Please enter course code"],
    uppercase: true,
    unique: true,
  },
  subjectName: {
    type: String,
    required: [true, "Please enter course name"],
    unique: true,
  },
});

CourseNameSchema.pre("save", function () {
  let name = this.name.split(" ");
  name = name.map(
    (item) => item[0].toUpperCase() + item.slice(1).toLowerCase()
  );
  name = name.join(" ");
  this.name = name;
});

module.export = mongoose.model("CourseName", CourseNameSchema);
