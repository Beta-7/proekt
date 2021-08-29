const express = require("express");
const app = express();
const faktura = require("../controllers/fakturaController.js")
const auth = require("../controllers/authController.js")
const exportService = require("../controllers/exportService")


app.post("/generirajFakturi", auth.authMiddleware, faktura.generirajFakturi)
app.get("/zemiFaktura", faktura.zemiFaktura)
app.post("/platiFaktura", auth.authMiddleware, faktura.platiFaktura)
app.post("/dodeliNagradi", auth.authMiddleware, faktura.dodeliNagradi)
app.post("/toExcel", auth.authMiddleware, exportService.toExcel)
app.post('/getFakturi', auth.authMiddleware,  faktura.getFakturi)


app.get("/zemiFaktura",faktura.zemiFaktura)
module.exports = app;