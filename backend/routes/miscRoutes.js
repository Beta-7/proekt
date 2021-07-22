const express = require("express");
const app = express();
const misc = require("../controllers/miscController.js")
const auth = require("../controllers/authController.js")

//TODO: auth middleware
app.post("/AddZelenaData",misc.updateZelenaEnergija)

module.exports = app;