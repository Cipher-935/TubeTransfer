const error_h = require("./Error/error_class.js");
const file_model =  require("../models/file_information_model.js");

const path_builder = function(file_name){
    const extension = file_name.split(".").pop();
    let loc = '';
    if(extension === "txt" || extension === "docx" || extension === "pdf" || extension === "pptx" || extension === "rtf"){
        loc += "documents/" + file_name;
        return loc;
    }
    else if(extension === "mp4" || extension === "mov" || extension === "mkv" || extension === "avi"){
        loc += "videos/" + file_name;
        return loc;
    }
    else if(extension === "png" || extension === "jpeg" || extension === "jpg" || extension === "bmp" || extension === "ico"){
        loc += "images/" + file_name;
        return loc;
    }
    else{
        loc += "other/" + file_name;
        return loc;
    }
}

exports.save_file_data = async (req,res,next) => {
    const {file_name, file_type, file_description, file_mime} = req.body;
    const storage_path = path_builder(file_name);
    try{
        const file_add = await file_model.create({uploded_file_name: file_name, uploaded_file_description: file_description, uploaded_file_type: file_type, uploaded_file_storage_location: storage_path});
        res.locals.store_path = storage_path;
        res.locals.ftype = file_mime;
        next();
    }
    catch(e){
        return next(new error_h("Could not add file details to the schema, check the post data", 500));
    }
}