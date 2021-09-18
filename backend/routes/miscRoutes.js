const express = require("express");
const app = express();
const misc = require("../controllers/miscController.js")
const auth = require("../controllers/authController.js")

//TODO: auth middleware
app.post("/AddZelenaData", auth.authMiddleware, misc.updateZelenaEnergija)
app.post("/UpdateNagrada", auth.authMiddleware, misc.updateNagradi)
app.post("/GetNagradi", auth.authMiddleware, misc.getNagradi)
app.post("/GetLogs", auth.authMiddleware, misc.getLogs)
app.post("/getKamati", auth.authMiddleware, misc.getKamati)
app.post("/addKamata", auth.authMiddleware, misc.addKamata)
app.post("/deleteKamata", auth.authMiddleware, misc.deleteKamata)

module.exports = app;