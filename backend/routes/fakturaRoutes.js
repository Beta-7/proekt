const express = require("express");
const app = express();
const faktura = require("../controllers/fakturaController.js")
const auth = require("../controllers/authController.js")

app.post("/generirajFakturi",faktura.generirajFakturi)
app.post("/zemiFaktura",faktura.zemiFaktura)
app.post("/platiFaktura",faktura.platiFaktura)
module.exports = app;