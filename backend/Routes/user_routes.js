const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller.js");
// All user routes and their respective functions
router.route("/signup").post(user_controller.user_sign_in);
router.route("/login").post(user_controller.user_login);
module.exports = router;