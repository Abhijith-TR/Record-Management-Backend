const express = require("express");
const router = express.Router();
const { adminRegister } = require("../controllers/admin");

router.route("/register/admin").post(adminRegister);
router.route("/delete/admin/:email").delete();

module.exports = router;
