const express = require("express");
const router = express.Router();
const { adminRegister, adminRemove } = require("../controllers/admin");
const { userRemove } = require("../controllers/user");

router.route("/register/admin").post(adminRegister);
router.route("/delete/admin/:email").delete(adminRemove);
router.route("/delete/user/:entryNumber").delete(userRemove);

module.exports = router;
