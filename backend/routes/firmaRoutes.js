const express = require("express");
const app = express();
const firma = require("../controllers/firmaController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/firmi/*

//TODO: authentication
app.post("/dodadiFirma",auth.authMiddleware,firma.dodadiFirma)
app.post("/promeniFirma", firma.promeniFirma)
app.post("/zemiFirmi",firma.zemiFirmi)
app.post("/izbrisiFirma",firma.izbrisiFirma)
module.exports = app;