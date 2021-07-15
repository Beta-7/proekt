const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db.js");

const authRoutes = require("./routes/authRoutes.js")
const firmaRoutes = require("./routes/firmaRoutes.js")
const userRoutes = require("./routes/usersRoutes.js")
const broiloRoutes = require("./routes/broiloRoutes.js")
const mernaTockaRoutes = require("./routes/mernaTockaRoutes")

const session=require("express-session")
const fileUpload = require('express-fileupload');
app.use(cors({credentials: true, origin: true}));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', '*');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(express.json());
//TODO: podobar session secret
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

app.use(fileUpload({
    limits: { fileSize: 500 * 1024 * 1024 },
  }));


app.use("/auth",authRoutes)
app.use("/firmi",firmaRoutes)
app.use("/user",userRoutes)
app.use("/broilo",broiloRoutes)
app.use("/mernaTocka",mernaTockaRoutes)