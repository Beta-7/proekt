const express = require("express");
const app = express();
const misc = require("../controllers/miscController.js")
const auth = require("../controllers/authController.js")

//TODO: auth middleware
app.post("/AddZelenaData",misc.updateZelenaEnergija)
app.post("/UpdateNagrada",misc.updateNagradi)
app.post("/GetNagradi",misc.getNagradi)
app.post("/GetLogs",misc.getLogs)
app.post("/getKamati",misc.getKamati)
module.exports = app;