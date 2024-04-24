
const fs = require("fs");
const path = require("path");
const stream = require("node:stream");
const zlib = require('node:zlib'); 



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


exports.stream_upload = async(req,res) => {
    const read = req;
    const write_stream = fs.createWriteStream("uploads/file.txt");
    read.on("data", (dat) => {
        if(!write_stream.write(dat)){
            read.pause();
        }
    });
    write_stream.on("drain", () =>{
        read.resume();
    });
    read.on("end", () => {
       write_stream.end();
       res.status(200).json({
        resp: "Successfully uploaded the file"
    });
    });
    read.on("error", (e) => {
        res.status(404).json({
            resp: "Error in the read stream"
        });
    });
    write_stream.on("error", () => {
        res.status(404).json({
            resp: "Error in the write stream"
        });
    });
}

exports.stream_c_upload = async(req,res) => {
    const contentType = req.headers['content-type'];
    const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)[1];

    // Split the body based on the boundary string
    const parts = req.body.replace (`--${boundary}`);

    // Remove the first and last parts (boundary and empty string)
    parts.shift();
    parts.pop();

    // Join the remaining parts to get the main data payload
    const mainData = parts.join('');

    // Now you can work with the main data payload
    console.log(mainData);
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