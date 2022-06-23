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
} = require("../controllers/data");

router.route("/register/admin").post(adminRegister);
router.route("/register/user").post(userRegister);
router.route("/change").patch(changeAdminPassword);
router
  .route("/records")
  .post(createRecord)
  .patch(updateRecord)
  .delete(deleteAllRecord)
  .get(showRecords);
router
  .route("/records/:entryNumber")
  .delete(deleteRecord)
  .get(showSingleRecord);

module.exports = router;
