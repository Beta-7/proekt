const express = require("express");
const app = express();
const faktura = require("../controllers/fakturaController.js")
const auth = require("../controllers/authController.js")
const exportService = require("../controllers/exportService")


app.post("/generirajFakturi", auth.authMiddleware, faktura.generirajFakturi)
app.get("/zemiFaktura", faktura.zemiFaktura)
app.get("/zemiFakturiMesec", faktura.zemiFakturiMesec)
app.post("/platiFaktura", auth.authMiddleware, faktura.platiFaktura)
<<<<<<< HEAD
// app.post("/dodeliNagradi", auth.authMiddleware, faktura.dodeliNagradi)
=======
//app.post("/dodeliNagradi", auth.authMiddleware, faktura.dodeliNagradi)
>>>>>>> c0ce7965a5b092e47b688dd9c72d79091505b3ad
app.post("/toExcel", auth.authMiddleware, exportService.toExcel)
app.post('/getFakturi', auth.authMiddleware,  faktura.getFakturi)


app.get("/zemiFaktura",faktura.zemiFaktura)
module.exports = app;