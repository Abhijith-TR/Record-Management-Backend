const express = require("express");
const router = express.Router();
const { adminRegister, adminRemove } = require("../controllers/admin").default;
const { userRemove } = require("../controllers/user");
const { deleteAllRecord } = require("../controllers/data");

router.route("/register/admin").post(adminRegister);
router.route("/delete/admin/:email").delete(adminRemove);
router.route("/delete/user/:entryNumber").delete(userRemove);
router.route("/delete/records/:subjectCode").delete(deleteAllRecord);

module.exports = router;
