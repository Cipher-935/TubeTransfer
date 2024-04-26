const mongoose = require("mongoose");
const file_schema = mongoose.Schema({

    uploded_file_name:{
        type: String,
        required: true
    },

    uploaded_file_extension: {
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


    // We will add the user model later

    // uploaded_file_author:{
    //     type: String,
    //     required: true
    // },
    
    // Whether the file is compressed or encrypted
    uploaded_file_type:{
        type: String,
        required: true
    },

    uploaded_file_storage_location: {
        type: String,
        required: true
    }

});

const file_data_model = mongoose.model("file_details", file_schema);
module.exports = file_data_model;
