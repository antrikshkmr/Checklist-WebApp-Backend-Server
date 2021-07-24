// ====================================================== //
// ================= Server Config File ================= //
// ====================================================== //

// Import Express
let express = require("express");

// Import Body Parser
let bodyParser = require("body-parser");

//Import Mongoose
let mongoose = require("mongoose");

// Fetch the environments variables
const dotenv = require("dotenv");
dotenv.config();

//Start App
let app = express();

// Handle CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token"
  );
  next();
});

// Import the API routes from routes.js file
let apiRoutes = require("./routes/routes");

// Use body-parser middleware to extract the body of an incoming request and parse it into a JSON
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Get MongoDB connection string from envrionment variables and set the connect options
const dbPath = process.env.DB_CONNECTION_STRING;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const mongo = mongoose.connect(dbPath, options);

// Connect to MongoDb
mongo.then(
  () => {},
  error => {
    console.log(error, "Error in connecting to MongoDb");
  }
);
var db = mongoose.connection;

if (!db) console.log("Error in connecting to MongoDb");
else console.log("MongoDB Connected Successfully");

//Use API routes in the App
app.use("/api", apiRoutes);

var port = process.env.PORT || 8000;

app.get("/", (req, res) => res.send("Welcome to Checklist Backend Server"));

// Starting the server to the specified port
app.listen(port, function() {
  console.log("Running Checklist Backend on Port " + port);
});
