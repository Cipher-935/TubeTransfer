
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const server = http.createServer(app);
const bodyParser = require('body-parser');
const route_handler = require("./Routes/app_routes.js");
const error_handler = require("./middlewares/error_handler.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // Middleware to exchange data in json format
app.use(cors());
// Serve static files from the 'templates' directory
app.use('/templates', express.static(path.join(__dirname, 'templates'))); // For serving files that are static

app.use("/", route_handler);

app.get("*", (req,res) => {
    res.status(200).json({
        resp: 'Not supported'
    });
});

app.use(error_handler);

server.listen(process.env.PORT, () =>  {
   console.log("App has stared");
});

mongoose.connect(process.env.CONN_STRNG,{useNewUrlParser: true}).then((conn) =>{
    console.log("Database connection successful");
});




