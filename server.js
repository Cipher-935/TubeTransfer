
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path: "./config"});
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);
const bodyParser = require('body-parser');
const route_handler = require("./Routes/app_routes.js");
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
server.listen(4000, () =>  {
   console.log("App has stared");
});




