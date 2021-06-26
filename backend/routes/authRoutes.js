const express = require("express");
const app = express();
const auth = require("../controllers/authController.js")


// localhost:5000/auth/*
app.post("/changePassword",auth.authMiddleware,auth.changePassword)
app.post("/register",auth.register);
app.post("/login",auth.login)
app.post("/whoami",auth.authMiddleware,auth.whoAmI)
app.post("/admin",auth.isAdmin, (req,res)=>{
    res.json({"asd":"asd"})
})
app.post("/resetPassword",auth.isAdmin,auth.resetPassword)


module.exports = app;