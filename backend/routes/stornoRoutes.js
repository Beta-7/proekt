const express = require("express");
const app = express();
const storno = require("../controllers/stornoController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/broilo/*
//TODO: authentication
app.post("/uploadStornoFile", auth.authMiddleware, storno.uploadStornoFile)
app.post("/getStornos", auth.authMiddleware, storno.getStornos)
app.post("/dodadiStorno", auth.authMiddleware, storno.dodadiStorno)
app.post("/promeniStorno", auth.authMiddleware, storno.promeniStorno)
app.post("/izbrisiStorno", auth.authMiddleware, storno.izbrisiStorno)
app.post("/reasociraj", auth.authMiddleware, storno.reasociate)

module.exports = app;