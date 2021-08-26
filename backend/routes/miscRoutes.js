const express = require("express");
const app = express();
const misc = require("../controllers/miscController.js")
const auth = require("../controllers/authController.js")

//TODO: auth middleware
app.post("/AddZelenaData",misc.updateZelenaEnergija, auth.authMiddleware)
app.post("/UpdateNagrada",misc.updateNagradi, auth.authMiddleware)
app.post("/GetNagradi",misc.getNagradi, auth.authMiddleware)
app.post("/GetLogs",misc.getLogs, auth.authMiddleware)
app.post("/getKamati",misc.getKamati, auth.authMiddleware)
module.exports = app;