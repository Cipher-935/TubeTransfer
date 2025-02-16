const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user_controller.js");
const mid = require("../middlewares/middlewares.js");
// All user routes and their respective functions



router.route("/signup").post(mid.sanitize_signup, user_controller.user_sign_in);

router.route("/login").post(mid.sanitize_login, user_controller.user_login);


//router.route("/user_data").get(user_controller.get_user_data);

router.post("/send_recovery_email", user_controller.send_recovery_email);


module.exports = router;