const express = require("express");
const app = express();
const stornoDisplay = require("../controllers/stornoDisplayController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/broilo/*
//TODO: authentication
app.post("/test",stornoDisplay.test)
module.exports = app;