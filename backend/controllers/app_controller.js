const fs = require("fs"); //For interacting with the static files
const path = require("path"); // To build the path
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner"); // For generating signed urls for S3 access
const file_model =  require("../models/file_information_model.js"); // For accessing the file schema
const error_h = require("../middlewares/Error/error_class.js"); // Importing the custom error class
//const redis = require("../redis_client.js"); // Redis client imported to store data in redis store, default port 6379

// Make the S3 client globally so all functions can access it so as to be modular
const s3 = new S3Client({
    credentials:{
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    region: process.env.bucket_location
});

// Make the storage location path for the s3 bucket as per the file etension and than return, makes putObject method modular

// Return the static template for the home.html from the templates directory
exports.get_home = async (req, res, next) => {
    let file_path = path.join(__dirname, "../templates/home.html");
      
    if(fs.existsSync(file_path)){
            
        res.sendFile(file_path);
    }
    else{
        return next(new error_h("Requested file is not found", 404));
    }
};

// exports.set_session = async (req,res, next) => {
   
//     const val = await redis.set("ddvfdvgrnjrenvfjdnf", JSON.stringify({name: "Jay", age: 30}));
//     const expiry = await redis.expire("ddvfdvgrnjrenvfjdnf", 60);
//     if(val && expiry){
//         res.status(200).json({
//             resp: "Successfully added the session"
//         });
//     }
//     else{
//         next(new error_h("Could not add the session dueto server error", 500));
//     }
// }

exports.test_load = async (req,res) => {
    res.status(200).json({
        resp: "Working"
    });
}

// exports.get_session = async (req,res,next) => {
//     const s_dat = await redis.get("ddvfdvgrnjrenvfjdnf");
//     const f_dat = await JSON.parse(s_dat);
//     if(s_dat){
//       res.status(200).json({
//         resp: f_dat
//       });
//     }
//     else{
//         next(new error_h("Could not find the data with this key", 500));
//     }
// }
// This functon returns a presigned url to access a private file on the s3.
exports.get_object = async (req,res,next) => {
    const {get_key} = req.body;
    const param = {
        Bucket: process.env.bucket_name,
        Key: get_key
    };
    const command = new GetObjectCommand(param);
    const url = await getSignedUrl(s3, command, {expiresIn: 60*2, signingDate: new Date()});
    if(url){
        res.status(200).json({
            resp: url
        });
    }
    else{
      return next(new error_h("Couldn't get the file at the moment, check the name again", 500));
    } 
}

// This function is used to delete the object form the s3
exports.delete_object = async (req,res,next) => {
    const {main_key} = req.body;
     const param = {
         Bucket: process.env.bucket_name,
         Key: main_key
     };
     const command = new DeleteObjectCommand(param);
     const del_response = await s3.send(command);
     if(del_response){
        res.status(200).json({
            resp: "Deleted"
        });
     }
     else{
        return next(new error_h("File was not deleted, check the key again", 500));
     }
}

// This function will list all the files present in the s3 bucket
exports.list_objects = async (req,res,next) => {
    const list_command = new ListObjectsV2Command({
        Bucket: process.env.bucket_name
    });
    const result = await s3.send(list_command);
    if(result){
        res.status(200).json({
            resp: result.Contents
        });
    }
    else{
        return next(new error_h("File was not deleted, check the key again", 500));
    }
}

// This function returns the signed url for the put request method giving access toprivate s3
exports.put_object_url = async (req,res,next) => {
    try{
        const put_command = new PutObjectCommand({
            Bucket: process.env.bucket_name,
            Key: res.locals.store_path,
            ContentType: res.locals.ftype
        });
        const put_url = await getSignedUrl(s3, put_command, {expiresIn: 6000});
        res.status(200).json({
            resp: put_url
        });
    }
    catch(e){
         return next(new error_h("Url was not generated due to some error", 500));
    }
}


