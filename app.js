const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Import all the Routes
const emailController = require("./controllers/emailControllers");

emailController.emailHandler();

module.exports = app;
