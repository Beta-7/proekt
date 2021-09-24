const express = require("express");
const app = express();
const user = require("../controllers/usersController.js")
const auth = require("../controllers/authController.js")

// localhost:5000/user/*


//TODO: authentication

app.post("/dodadiUser",auth.authMiddleware,user.dodadiUser)
app.post("/promeniUser", auth.authMiddleware, user.promeniUser)
app.post("/izbrisiUser", auth.authMiddleware, user.izbrisiUser)
app.post("/getUsers", auth.authMiddleware, user.getUsers)

module.exports = app;