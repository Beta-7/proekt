const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db.js");
const authRoutes = require("./routes/authRoutes.js")
const session=require("express-session")


app.use(cors({credentials: true, origin: true}));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', '*');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(express.json());
app.use(session({
    secret: "asdasdasd",
    resave: false,
    saveUnInitialized: false
}))

app.listen(5000, ()=>{
    console.log("Listening on 5000");
})

db.sync();

db.authenticate().then(()=>{console.log("DB connected")}).catch(()=>{console.log("Error: " +err)})

app.use("/auth",authRoutes)