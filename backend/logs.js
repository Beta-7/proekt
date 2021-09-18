const Log = require("./models/log")

const generateLog = async(message, actor="SYSTEM",actedon=null) =>{
    await Log.create({
        message,
        actor,
        actedon
    })
}

module.exports = generateLog