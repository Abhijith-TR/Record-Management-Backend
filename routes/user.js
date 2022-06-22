const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { changeUserPassword } = require("../controllers/password");

router.route("/change").patch(changeUserPassword);
router.route("/records").get();

module.exports = router;
