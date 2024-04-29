const mongoose = require("mongoose");
const file_schema = mongoose.Schema({

    uploded_file_name:{
        type: String,
        required: true
    },
    
    uploaded_file_description:{
        type: String,
        required: true
    },

    uploaded_file_date:{
        type: Date,
        default: Date.now,
        required: true
    },

    uploaded_file_owner: {
        type: String,
        ref: "Users.user_id",
        required: true
        
    },
    
    uploaded_file_size: {
        type: Number,
        required: true
    },
    
    uploaded_file_storage_location: {
        type: String,
        required: true
    }
});

const file_data_model = mongoose.model("file_details", file_schema);
module.exports = file_data_model;
