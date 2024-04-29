
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const cluster = require("cluster");
const os = require("node:os");
const cpu_length = os.availableParallelism();

if(cluster.isPrimary){
    for(let i = 0; i < cpu_length; i++){
        cluster.fork();
    }
}
else{

const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const server = http.createServer(app);
const bodyParser = require('body-parser');
const app_route_handler = require("./Routes/app_routes.js");
const user_route_handler = require("./Routes/user_routes.js");
const error_handler = require("./middlewares/Error/error_handler.js");
app.use(bodyParser.urlencoded({ extended: false })); // For handling the url encoded body data often in file uploads
app.use(express.json()); // Middleware to exchange data in json format
 
app.use(cors()); // For cross origin request handling
app.use('/templates', express.static(path.join(__dirname, 'templates')));// Serve static files from the 'templates' directory

app.use(cors());

const user_routes = require('./Routes/user_routes.js');

// Serve static files from the 'templates' directory
app.use('/templates', express.static(path.join(__dirname, 'templates'))); // For serving files that are static


app.use("/", app_route_handler); // using the route handler to server multiple routes
app.use("/", user_route_handler);


// Unhandled routes go here

// User routes
app.use("/user", user_routes);

app.get("*", (req,res) => {
    res.status(200).json({
        resp: 'Not supported'
    });
});

app.use(error_handler); // Cusotm error handler middleware imported as a file

// http server listens on configured port from the env
server.listen(process.env.PORT, () =>  {
   console.log("App has stared");
});

// Mongoose middleware to connect with the mongoDb on atlas
mongoose.connect(process.env.CONN_STRNG,{useNewUrlParser: true}).then((conn) =>{
    console.log("Database connection successful");
});

}





