const express = require("express");
const router = express.Router();
const controller = require("../controllers/app_controller.js");
const mid = require("../middlewares/middlewares.js");

const mail_service = require("../services/emailService.js");

router.route("/home").get(controller.get_home);

router.route("/delete").post(mid.check_cookie, mid.delete_file_data, controller.delete_object);

router.route("/download").post(mid.check_cookie, mid.get_path, controller.get_object);

router.route("/dash").get(mid.check_cookie, controller.get_dash);

router.route("/upload").post(mid.check_cookie , mid.sanitize_inputs, mid.save_file_data, controller.put_object_url);

router.route("/list").get(mid.check_cookie, controller.dash_data);

router.route("/logout").get(controller.logout);

router.route("/share_link").post(mid.check_cookie, controller.get_object_timebound, mail_service.share_mail);

router.route("/signup_form").get(controller.get_sign);
router.route("/login-form").get(controller.get_login);

module.exports = router;