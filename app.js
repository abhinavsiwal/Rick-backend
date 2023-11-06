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
require("./controllers/emailControllers")


app.use("*", (req, res, next) => {
    const error = {
      status: 404,
      message: "Api not found.",
    };
    next(error);
  });
  
  app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || "Internal server error.";
    const data = err.data || null;
    res.status(status).json({
      type: "error",
      message,
      data,
    });
  });

module.exports = app;
