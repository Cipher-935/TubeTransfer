const express = require("express");
const router = express.Router();
const controller = require("../controllers/app_controller.js");

// All app routes and their respective functions are defined here

router.route("/home").get(controller.get_home);

router.route("/delete").post(controller.delete_object);

router.route("/get-presign-link").post(controller.get_object);

router.route("/get-list").get(controller.list_objects);

router.route("/get-put-url").post(controller.put_object_url);

module.exports = router;