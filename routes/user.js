const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { changeUserPassword } = require("../controllers/password");
const { showSingleRecord } = require("../controllers/data");
const { getAnnouncements } = require("../controllers/announcement");

router.route("/change").patch(changeUserPassword);
router.route("/records/:entryNumber").get(showSingleRecord);
router.route("/notif/:subjectCode").get(getAnnouncements);

module.exports = router;
