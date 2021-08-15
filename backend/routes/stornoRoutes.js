const express = require("express");
const app = express();
const storno = require("../controllers/stornoController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/broilo/*
//TODO: authentication
app.post("/uploadStornoFile",storno.uploadStornoFile)
app.post("/getStornos",storno.getStornos)
app.post("/dodadiStorno", storno.dodadiStorno)
app.post("/promeniStorno", storno.promeniStorno)
app.post("/izbrisiStorno", storno.izbrisiStorno)
app.post("/reasociraj", storno.reasociate)

module.exports = app;