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

router.route("/delete").post(async (req,res) => {
    
    const {main_key} = req.body;
    const s3 = new S3Client({
        credentials:{
             accessKeyId: 'AKIAVKFZNFSAFNE5KZ57',
             secretAccessKey: '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'
         },
         region: "ca-central-1"
     });
     const param = {
         Bucket: "wrefesfverfgefrg",
         Key: main_key
     };
     
     const command = new DeleteObjectCommand(param);
     try{
        const del_response = await s3.send(command);
        res.status(200).json({
            resp: "Deleted"
        })
     }
     catch(e){
        res.status(404).json({
            resp: "Could not delete"
        });
     }
});

router.route("/stream").post(controller.stream_c_upload);


module.exports = router;