const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { userLogin } = require("../controllers/user");
const { adminLogin } = require("../controllers/admin");

router.route("/user").post(userLogin);
router.route("/admin").post(adminLogin);

module.exports = router;
