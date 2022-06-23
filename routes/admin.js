const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { adminRegister } = require("../controllers/admin");
const { userRegister } = require("../controllers/user");
const { changeAdminPassword } = require("../controllers/password");
const {
  showRecords,
  showSingleRecord,
  updateRecord,
  deleteRecord,
  deleteAllRecord,
  createRecord,
  createSubject,
} = require("../controllers/data");

router.route("/register/admin").post(adminRegister);
router.route("/register/user").post(userRegister);
router.route("/change").patch(changeAdminPassword);
router.route("/records").post(createSubject);
router.route("/records/:subjectCode").get(showRecords).delete(deleteAllRecord);
router
  .route("/records/:entryNumber")
  .delete(deleteRecord)
  .patch(updateRecord)
  .post(createRecord);
router.route("/records/get/:entryNumber").get(showSingleRecord);

module.exports = router;
