const Log = require("./models/log")

const generateLog = (message, actor="SYSTEM",actedon=null) =>{
    Log.create({
        message,
        actor,
        actedon
    })
}

module.exports = generateLog