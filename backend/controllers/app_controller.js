const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const file_model =  require("../models/file_information_model.js");
const mongoose = require("mongoose");

const s3 = new S3Client({
    credentials:{
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.bucket_location
});

exports.get_home = async (req, res) => {
    try{
        let file_path = path.join(__dirname, "../templates/home.html");
      
        if(fs.existsSync(file_path)){
            
            res.sendFile(file_path);
        }
        else{
            res.status(404).json({
                resp: "File not found"
            });
        }
    }
    catch(e){
        res.status(404).json({
            resp: "Some error on the server side"
        });
    }
};

// This functon returns a presigned url to access a private file on the s3.
exports.get_object = async (req,res) => {
    try{
        const {get_key} = req.body;
        const param = {
            Bucket: process.env.bucket_name,
            Key: get_key
        };
        const command = new GetObjectCommand(param);
    
        const url = await getSignedUrl(s3, command, {expiresIn: 60*2, signingDate: new Date()});
        console.log(url);
        res.status(200).json({
            resp: url
        });
    }
    catch(e){
        console.log(e);
         res.status(404).json({
            resp: "Some error has occured on server side"
         });
    }
}

// This function is used to delete the object form the s3
exports.delete_object = async (req,res) => {
    const {main_key} = req.body;
     const param = {
         Bucket: process.env.bucket_name,
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
}

exports.list_objects = async (req,res) => {
    const list_command = new ListObjectsV2Command({
        Bucket: process.env.bucket_name
    });
    const result = await s3.send(list_command);
    res.status(200).json({
        resp: result.Contents
    });

}

exports.put_object_url = async (req,res) => {
    try{
        const {file_name, file_type, file_description, file_mime} = req.body;
        const file_extension = file_name.split(".").pop();
        let loc = '';
        if(file_extension === "txt"){
            loc += "documents/" + file_name;
        }
        else if(file_extension === 'mp4'){
            loc += "videos/" + file_name;
        }
        else{
            loc += file_name;
        }
        const file_add = await file_model.create({uploded_file_name: file_name, uploaded_file_extension: file_extension, uploaded_file_description: file_description, uploaded_file_type: file_type, uploaded_file_storage_location: loc});
        if(file_add){
            const put_command = new PutObjectCommand({
                Bucket: process.env.bucket_name,
                Key: loc,
                ContentType: file_mime
            });
            const put_url = await getSignedUrl(s3, put_command, {expiresIn: 6000});
            res.status(200).json({
                resp: put_url
            });
        }
        else{
            res.status(404).json({
                resp: "Could not save the data to db"
           });  
        }
    }
    catch(e){
       res.status(404).json({
            resp: "Error saving the data: " + e
       });  
    }

}


