const express = require("express");
const app = express();
const firma = require("../controllers/firmaController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/auth/*
app.post("/dodadiFirma",auth.authMiddleware,firma.dodadiFirma)
// app.post("/uploadFile",auth.authMiddleware,firma.uploadFile)

module.exports = app;