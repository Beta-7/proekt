const express = require("express");
const app = express();
const faktura = require("../controllers/fakturaController.js")
const auth = require("../controllers/authController.js")
const exportService = require("../controllers/exportService")


app.post("/generirajFakturi",faktura.generirajFakturi)
app.post("/zemiFaktura",faktura.zemiFaktura)
app.post("/platiFaktura",faktura.platiFaktura)
app.post("/dodeliNagradi",faktura.dodeliNagradi)
app.post("/toExcel", exportService.toExcel)
module.exports = app;