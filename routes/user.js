const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const { login, register } = require("../controllers/user");

router.route("/login").post(login);
router.route("/register").post(register);

module.exports = router;
