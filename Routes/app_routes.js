const express = require("express");
const router = express.Router();
const controller = require("../controllers/app_controller.js");
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const multer = require("multer");
const store = multer.memoryStorage();
const upload = multer({storage: store});

// All app routes and their respective functions are defined here

router.route("/home").get(controller.get_home);

router.route("/upload").post(upload.single("file_data"), async (req,res) => {
    const s3 = new S3Client({
       credentials:{
            accessKeyId: 'AKIAVKFZNFSAFNE5KZ57',
            secretAccessKey: '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'
        },
        region: "ca-central-1"
    }); 
    const param = {
        Body: req.file.buffer,
        Key: req.file.originalname,
        Bucket: "wrefesfverfgefrg",
        ContentType: req.file.mimetype
    };
    const command = new PutObjectCommand(param);
    s3.send(command);
    res.status(200).json({
        resp:"Uploaded"
    });
});

router.route("/delete").post(controller.delete_object);

router.route("/pipeline").post(controller.stream_c_upload);

router.route("/get-presign-link").post(controller.get_object);

router.route("/get-list").get(controller.list_objects);

router.route("/get-put-url").post(controller.put_object_url);




module.exports = router;