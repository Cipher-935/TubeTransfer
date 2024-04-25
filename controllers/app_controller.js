
const fs = require("fs");
const path = require("path");
const stream = require("node:stream");
const zlib = require('node:zlib');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const signer = require("@aws-sdk/s3-request-presigner");



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
        const s3 = new S3Client({
            region: "ca-central-1",
            credentials:{
                accessKeyId:'AKIAVKFZNFSAFNE5KZ57' ,
                secretAccessKey: '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'
            }
        });
        const param = {
            Bucket: 'wrefesfverfgefrg',
            Key: get_key
        };
        const command = new GetObjectCommand(param);
        const url = await signer.getSignedUrl(s3, command, {expiresIn: 60000});
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
}

exports.list_objects = async (req,res) => {
    const s3 = new S3Client({
        credentials:{
            accessKeyId: 'AKIAVKFZNFSAFNE5KZ57',
            secretAccessKey: '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'
        },
        region: "ca-central-1"
    });
    const list_command = new ListObjectsV2Command({
        Bucket: "wrefesfverfgefrg"
    });
    const result = await s3.send(list_command);
    res.status(200).json({
        resp: result.Contents
    });

}

exports.put_object_url = async (req,res) => {
    const {file_name, file_type} = req.body;
    const s3 = new S3Client({
        credentials:{
            accessKeyId: 'AKIAVKFZNFSAFNE5KZ57',
            secretAccessKey: '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'
        },
        region: "ca-central-1"
    });
    const put_command = new PutObjectCommand({
        Bucket: "wrefesfverfgefrg",
        Key: file_name,
        ContentType: file_type
    });
    const put_url = await signer.getSignedUrl(s3, put_command, {expiresIn: 6000});
    res.status(200).json({
        resp: put_url
    });
}
 

// Compressing pipeline for storing the data to the uploads using pipe streams
exports.stream_c_upload = async(req,res) => {
    const read = req;
    const write_stream = fs.createWriteStream("uploads/file.txt.gz");

    const gzip = zlib.createGzip(); // Create a gzip transform stream

    // Pipe the read stream through the gzip stream and then to the write stream
    read.pipe(gzip).pipe(write_stream);

    // Handle events
    read.on("error", (error) => {
        console.error('Error in the read stream:', error);
        res.status(500).json({ resp: 'Error in the read stream' });
    });

    write_stream.on("error", (error) => {
        console.error('Error in the write stream:', error);
        res.status(500).json({ resp: 'Error in the write stream' });
    });

    write_stream.on("finish", () => {
        res.status(200).json({ resp: 'Successfully uploaded and compressed the file' });
    });
}