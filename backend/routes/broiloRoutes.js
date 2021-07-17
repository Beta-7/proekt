const express = require("express");
const app = express();
const broilo = require("../controllers/broiloController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/broilo/*
//TODO: authentication

app.post("/getBroilos",auth.authMiddleware,broilo.getBroilos)
app.post("/uploadFile",broilo.uploadFile)
app.post("/asocirajBroilo",broilo.asocirajBroilo)
module.exports = app;