const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { userRegister } = require("../controllers/user");
const { changeAdminPassword } = require("../controllers/password");
const {
  postAnnouncement,
  removeAnnouncement,
  getAnnouncements,
} = require("../controllers/announcement");
const {
  showRecords,
  showSingleRecord,
  updateRecord,
  deleteRecord,
  createRecord,
  createSubject,
} = require("../controllers/data");

router.route("/register/user").post(userRegister);
router.route("/change").patch(changeAdminPassword);
router.route("/records").post(createSubject);
router.route("/records/:subjectCode").get(showRecords);
router.route("/records/single").post(createRecord);
router.route("/records/get/:entryNumber").get(showSingleRecord);
router
  .route("/records/:entryNumber/:subjectCode")
  .delete(deleteRecord)
  .patch(updateRecord);
router.route("/notif").post(postAnnouncement);
router.route("/notif/:subjectCode").get(getAnnouncements);
router.route("/notif/:subjectCode/:id").delete(removeAnnouncement);

module.exports = router;
