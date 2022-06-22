const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { adminRegister } = require("../controllers/admin");
const { userRegister } = require("../controllers/user");

router.route("/register/admin").post(adminRegister);
router.route("/register/user").post(userRegister);
router.route("/change").post();
router.route("/records").post().patch().delete().get();

module.exports = router;
