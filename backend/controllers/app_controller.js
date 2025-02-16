const fs = require("fs"); //For interacting with the static files
const path = require("path"); // To build the path
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner"); // For generating signed urls for S3 access
const file_model =  require("../models/file_information_model.js"); // For accessing the file schema
const error_h = require("../middlewares/Error/error_class.js"); // Importing the custom error class
const user_model = require("../models/user_model.js");

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

exports.get_sign = async (req, res, next) => {
    let file_path = path.join(__dirname, "../templates/signup.html");
      
    if(fs.existsSync(file_path)){
            
        res.sendFile(file_path);
    }
    else{
        return next(new error_h("Requested file is not found", 404));
    }
};

exports.get_login = async (req, res, next) => {
    let file_path = path.join(__dirname, "../templates/login.html");
      
    if(fs.existsSync(file_path)){
            
        res.sendFile(file_path);
    }
    else{
        return next(new error_h("Requested file is not found", 404));
    }
};

exports.get_dash = async (req, res, next) => {
    let file_path = path.join(__dirname, "../templates/dashboard.html");
      
    if(fs.existsSync(file_path)){
            
        res.sendFile(file_path);
    }
    else{
        return next(new error_h("Requested file is not found", 404));
    }
};


// This functon returns a presigned url to access a private file on the s3.
exports.get_object = async (req,res,next) => {
    const param = {
        Bucket: process.env.bucket_name,
        Key: res.locals.d_path
    };
    const command = new GetObjectCommand(param);
    const currentTimeUtc = new Date(); // get the current utc time format
    const expirationTimeUtc = new Date(currentTimeUtc.getTime() + 300);
    const url = await getSignedUrl(s3, command, {expiresIn: 300, signingDate: expirationTimeUtc});
    console.log(url);
    if(url){
        res.status(200).json({
            resp: url
        });
    }
    else{
      return next(new error_h("Couldn't get the file at the moment, check the name again", 500));
    } 
}


exports.logout = async (req,res,next) => {
        res.clearCookie('uid');
        res.status(200).json({
            resp: "Logged out"
        });
}


exports.get_object_timebound = async (req,res,next) => {
    const {get_key, v_time} = req.body;
    const param = {
        Bucket: process.env.bucket_name,
        Key: get_key
    };
    const command = new GetObjectCommand(param);
    const curr_utc = new Date();
    const ex_cal_time = new Date(curr_utc.getTime() + v_time*60)
    const url = await getSignedUrl(s3, command, {expiresIn: 60*v_time, signingDate: ex_cal_time});
    if(url){
       res.locals.surl = url;
       next()
    }
    else{
      return next(new error_h("Couldn't get the file at the moment, check the name again", 500));
    } 
}

// This function is used to delete the object form the s3
exports.delete_object = async (req,res,next) => {
     const param = {
         Bucket: process.env.bucket_name,
         Key: res.locals.del_location
     };
     const command = new DeleteObjectCommand(param); 
        try{
            const del_response = await s3.send(command);
            res.status(200).json({
                resp: "Deleted successfully"
            })
        }
        catch(e){
            return next(new error_h(`Could not delete: ${e}`, 500));
        }
    }


exports.dash_data = async (req,res, next) => {
    try{
        const all_files = await file_model.find({uploaded_file_owner: res.locals.uid}).select({_id:0 ,uploded_file_name:1, uploaded_file_description:1, uploaded_file_date:1, uploaded_file_category:1, uploaded_file_size:1});
        const user_name = await user_model.findById(res.locals.uid);
        const f_name = user_name.name;
        res.status(200).json({
            all_files, f_name
        });
    }
    catch(e){
         return next(new error_h(`Error: ${e}`, 500));
    }  
}

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


