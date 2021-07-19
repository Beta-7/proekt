const express = require("express");
const app = express();
const mernaTocka = require("../controllers/mernaTockaController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/mernaTocka/*

//TODO: remove route - will be used internally. currently added for testing
app.post("/dodadiMernaTocka",mernaTocka.dodadiMernaTocka)
app.post("/PromeniMernaTocka",mernaTocka.promeniMernaTocka)
app.post("/getMerniTocki",mernaTocka.getMerniTocki)
app.post("/izbrisiMernaTocka",mernaTocka.izbrisiMernaTocka)
module.exports = app;