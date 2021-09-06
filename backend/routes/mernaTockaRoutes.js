const express = require("express");
const app = express();
const mernaTocka = require("../controllers/mernaTockaController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/mernaTocka/*

//TODO: remove route - will be used internally. currently added for testing
app.post("/dodadiMernaTocka", auth.authMiddleware, mernaTocka.dodadiMernaTocka)
app.post("/PromeniMernaTocka", auth.authMiddleware, mernaTocka.promeniMernaTocka)
app.post("/getMerniTocki", auth.authMiddleware, mernaTocka.getMerniTocki)
app.post("/izbrisiMernaTocka", auth.authMiddleware, mernaTocka.izbrisiMernaTocka)
app.post("/najdiNeasocirani",auth.authMiddleware,mernaTocka.najdiNeasocirani)
module.exports = app;