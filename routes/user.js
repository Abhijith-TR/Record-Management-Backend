const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();

router.route("/change").post();
router.route("/records").get();

module.exports = router;
