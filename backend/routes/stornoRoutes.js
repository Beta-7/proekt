const express = require("express");
const app = express();
const storno = require("../controllers/stornoController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/broilo/*
//TODO: authentication
app.post("/uploadStornoFile",storno.uploadStornoFile)
module.exports = app;