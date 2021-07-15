const express = require("express");
const app = express();
const user = require("../controllers/usersController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/user/*


//TODO: authentication

app.post("/dodadiUser",auth.authMiddleware,user.dodadiUser)
app.post("/promeniUser", user.promeniUser)
app.post("/izbrisiUser", user.izbrisiUser)
module.exports = app;