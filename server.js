let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
let app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, token"
  );
  next();
});
let apiRoutes = require("./routes/routes");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const dbPath = process.env.DB_CONNECTION_STRING;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const mongo = mongoose.connect(dbPath, options);

mongo.then(
  () => {},
  error => {
    console.log(error, "Error in connecting to MongoDb");
  }
);
var db = mongoose.connection;

if (!db) console.log("Error in connecting to MongoDb");
else console.log("MongoDB Connected Successfully");

var port = process.env.PORT || 8000;

app.use("/api", apiRoutes);
app.listen(port, function() {
  console.log("Running SmartChecklist Backend on Port " + port);
});
